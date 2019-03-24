/**
 * ProducerWorker
 * 2.1.1
 */

import Promise from 'bluebird';
import uuid from 'uuid';
import _ from 'lodash';

export default class ProducerWorker {
  constructor(queueName, logger, name, connection) {

    if (!queueName) {
      throw new Error('[MQ] A queue name is required to connect to MQ');
    }

    this.queueName = queueName;
    this.name = name || uuid();
    this.logger = logger;
    this.channel = null;
    this.isBlocked = false;
    this.isBusy = false;
    this.isClosed = true;
    this.restartTimeout = 5000; // 5s
    // calcul create the queue, assert it only once
    this.asserted = false;
    // priority queue (needs to be the same in consumer worker)
    this.maxPriority = 3;
    this.over = true;
    this.connection = connection;
  }

  createChannel() {
    let channel;
    return this.connection.getConnection(this.name)
      .then((connection) => {
        return connection.createChannel();
      })
      .then((chan) => {
        channel = chan;
        const channelId = channel.ch;
        this.logger.verbose(`[MQ - ${this.name}] Opened channel ${channelId}`);

        channel.on('close', () => {
          this.logger.verbose(`[MQ - ${this.name}] The MQ channel ${channelId} closed.`);
          this.channel = null;
          this.isClosed = true;
          this.asserted = null;
        });

        channel.on('error', (err) => {
          this.logger.error(`[MQ - ${this.name}] The MQ channel errored:`, err);
        });

        if (this.asserted) {
          return;
        }

        // result of channel.assertQueue is not needed, promise is returned only for synchronisation
        return channel.assertQueue(this.queueName, { durable: true, maxPriority: this.maxPriority })
          .then(() => {
            this.asserted = true;
          })
        ;
      })
      .then(() => {
        this.isClosed = false;
        this.logger.verbose(`[MQ - ${this.name}] Queue state OK.`);
        this.logger.verbose(`[MQ - ${this.name}] New channel ${channel.ch} is up an running.`);
        return channel;
      })
      .catch((err) => {
        this.logger.error(`[MQ - ${this.name}] An error happened during start. `, err);
        return Promise.reject(err);
      })
    ;
  }

  publish(messages, options) {

    this.over = false;
    // we need to have multiple channels in order to manage simultaneous
    // api call.
    return this.createChannel()
      .then(newChannel => {
        const wrapMessages = !_.isArray(messages) ? [messages] : messages;
        if (!newChannel) {
          return Promise.reject(new Error(`[MQ - ${this.name}] Channel Undefined`));
        }


        // priority of message default to 0 if not specified
        const defaultOptions = {
          persistent: true,
          priority: 0,
          // mandatory: true,
          timestamp: (new Date()).getTime(),
        };

        const localOptions = _.defaults({}, options, defaultOptions);
        const messagesLength = _.size(wrapMessages);
        let sent = 0;

        return (new Promise((resolve) => {
          const flowControl = (firstTime = false) => {

            if (!firstTime) {
              this.logger.info(`[MQ - ${this.name}] Using flow control, sent:`, sent, messagesLength);
            }

            newChannel.once('drain', () => {
              this.logger.warn(`[MQ - ${this.name}] The MQ channel is no more busy, resuming publish`);
              this.isBusy = false;
              flowControl();
            });

            let keepGoing = true;
            while (keepGoing) {
              if (sent >= messagesLength) {
                return resolve('over');
              }

              // keep busy will be false if write buffer is full
              keepGoing = newChannel.sendToQueue(
                this.queueName,
                this.messageToBuffer(wrapMessages[sent]),
                localOptions
              );
              sent++;
            }
          };

          flowControl(true);
        }))
          .finally(() => {
            this.logger.verbose(`[MQ - ${this.name}] Done sending stuff, closing channel...`);
            this.over = true;
            return newChannel.close();
          })
        ;
      })
    ;
  }

  messageToBuffer(message) {
    if (!_.isObject(message)) {
      this.logger.error(`[MQ - ${this.name}] This message is not an object message`, message);
      throw new Error(`[MQ - ${this.name}] This message is not an object message`);
    }
    this.logger.verbose(`[MQ - ${this.name}] Message sent to ${this.queueName} queue`, message);

    let parsedMessage;
    try {
      parsedMessage = JSON.stringify(message);
    } catch (e) {
      this.logger.error(`[MQ - ${this.name}] This message can't be stringified`, message);
      throw e;
    }
    // Buffer.from will be available in node >4.X.X
    return new Buffer(parsedMessage);
  }

}
