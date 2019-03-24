/**
 * ProducerPubSub
 * 2.2.0
 */

import Promise from 'bluebird';
import _ from 'lodash';
import uuid from 'uuid';

export default class ProducerPubSub {
  constructor(exchangeName, logger, name, connection) {
    if (!exchangeName) {
      throw new Error('[MQPubSub] An exchange name is required to connect to MQPubSub');
    }

    this.exchangeName = exchangeName;
    this.name = name || uuid();
    this.logger = logger;
    this.connection = null;
    this.channel = null;
    this.isBlocked = false;
    this.isBusy = false;
    this.isClosed = true;
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
        this.logger.verbose(`[MQ - ${this.name}] Opened channel ${channelId} for exchange ${this.exchangeName}`);

        channel.on('close', () => {
          this.logger.verbose(`[MQ - ${this.name}] The MQ channel ${channelId} closed.`);
          this.channel = null;
          this.isClosed = true;
        });

        channel.on('error', (err) => {
          this.logger.error(`[MQ - ${this.name}] The MQ channel errored:`, err);
        });

        return channel.assertExchange(this.exchangeName, 'direct', { durable: true });
      })
      .catch((err) => {
        this.logger.error(`[MQ - ${this.name}] An error happened during start ${this.name}:`, err);
        return Promise.reject(err);
      })
      .then(() => {
        this.isClosed = false;
        this.logger.verbose(`[MQ - ${this.name}] Exchange state OK.`);
        return channel;
      })
    ;
  }

  /*
   * message: Message to publish
   * key: routing key
   */
  publish(message, key) {

    const routingKey = _.isString(key) ? key : '';
    return this.createChannel()
      .then(newChannel => {
        if (!newChannel) {
          return Promise.reject(new Error(`[MQ - ${this.name}] Channel Undefined`));
        }

        const defaultOptions = {
          persistent: true,
          // mandatory: true,
          timestamp: (new Date()).getTime(),
        };

        return new Promise((resolve) => {
          const flowControl = (firstTime = false) => {

            if (!firstTime) {
              this.logger.info(`[MQ - ${this.name}] Using flow control`);
            }

            newChannel.once('drain', () => {
              this.logger.warn(`[MQ - ${this.name}] The MQ channel is no more busy, resuming publish`);
              this.isBusy = false;
              flowControl();
            });

            if (this.isBusy) {
              return ;
            }

            // it will return false if the channel is busy
            // would be useful if we wanted to send more than one msg at a time
            // eslint-disable-next-line
            newChannel.publish(
              this.exchangeName,
              routingKey,
              this.messageToBuffer(message),
              defaultOptions
            );

            return resolve(newChannel);
          };

          flowControl(true);
        });
      })
      .then((newChannel) => {
        this.logger.verbose(`[MQ - ${this.name}] Done sending stuff, closing channel...`);
        return newChannel.close();
      })
    ;
  }

  messageToBuffer(message) {
    if (!_.isObject(message)) {
      this.logger.error(`[MQ - ${this.name}] This message is not an object message`, message);
      throw new Error(`[MQ - ${this.name}] This message is not an object message`);
    }

    this.logger.verbose(`[MQ - ${this.name}] Message sent to ${this.exchangeName} exchange`, message);

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
