/**
 * ConsumerWorker
 * 2.2.0
 */

import Promise from 'bluebird';
import _ from 'lodash';
import uuid from 'uuid';

export default class ConsumerWorker {
  constructor(queueName, logger, listener, name, connection, exchanges, bindingKeys) {
    if (!queueName) {
      throw new Error('[MQ] A queue name is required to connect to MQ');
    }

    if (!_.isFunction(listener)) {
      throw new Error('[MQ] listener need to be a function');
    }

    this.exchanges = _.compact(_.isArray(exchanges) ? exchanges : [exchanges]);
    this.bindingKeys =  _.compact(_.isArray(bindingKeys) ? bindingKeys : [bindingKeys]);
    this.bindingKeys = _.size(this.bindingKeys) ? this.bindingKeys : [''];
    this.queueName = queueName;
    this.prefetchMax = 5; // how many msgs the worker can take at a time
    this.maxWorkers = 24;
    this.maxPriority = 3;
    this.name = name || uuid();
    this.logger = logger;
    this.channel = null;
    // auto restart on close
    this.timeout = null;
    this.isClosed = true;
    // how long before trying to re establish connection
    this.restartTimeout = 5000;
    // function that will be executing when consuming pile.
    this.listener = listener;
    this.connection = connection;
  }

  start() {
    if (!_.isNull(this.timeout)) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    return this.connection.getConnection(this.name)
      .then((connection) => {
        return connection.createChannel();
      })
      .then((channel) => {
        this.channel = channel;
        this.logger.info(`[MQ - ${this.name}] Opened channel ${this.channel.ch} for queue ${this.queueName}`);

        this.channel.on('close', () => {
          this.logger.info(`[MQ - ${this.name}] The MQ channel closed.`);
          this.channel = null;
          this.isClosed = true;
          this.timeout = setTimeout(() => {
            return this.start();
          }, this.restartTimeout);
        });

        this.channel.on('error', (err) => {
          this.logger.error(`[MQ - ${this.name}] The MQ channel errored:`, err);
        });

        return this.channel.assertQueue(this.queueName, { durable: true, maxPriority: this.maxPriority });
      })
      .then(() => {
        const bindingPromises = [];
        // make sure queue is binded to all exchanges
        _.each(this.exchanges, (exchange) => {
          // make sure we're binding to all routing keys
          _.each(this.bindingKeys, (key) => {
            this.logger.info(`[MQ - ${this.name}] Binding ${this.queueName} to exchange: ${exchange} with routing ` +
            `key: ${key || '""'}` );
            bindingPromises.push(this.channel.bindQueue(this.queueName, exchange, key));
          });
        });
        return Promise.all(bindingPromises);
      })
      .then(() => {
        this.isClosed = false;
        this.logger.info(`[MQ - ${this.name}] Queue state OK.`);
        return this.channel.prefetch(this.prefetchMax);
      })
      .then(() => {
        this.logger.info(`[MQ - ${this.name}] Creating ${this.maxWorkers} workers...`);
        const promises = [];
        for (var i = 0; i < this.maxWorkers; i++) {
          promises.push(this.attachListener(`${i}`, i));
        }
        return Promise.all(promises);
      })
      .catch((err) => {
        this.logger.error(`[MQ - ${this.name}] An error happened during start ${this.name}:`, err);
        return Promise.reject(err);
      })
    ;
  }

  attachListener(consumerTag, index) {
    return this.channel.consume(this.queueName, (message) => {
      if (_.isNull(message)) {
        // legacy, why ?????
        this.logger.warn(`[MQ - ${this.name}] This consumer (${this.name}) has been cancelled ` +
          `from ${this.queueName} queue`);
        return;
      }

      const parsedMessage = this.bufferToMessage(message);
      return this.listener(parsedMessage)
        .then(() => {
          this.logger.verbose(`[MQ - ${this.name}] Message from ${this.queueName} queue has successfully ` +
            'been processed', parsedMessage);

          if (_.isNull(this.channel)) {
            this.logger.error(`[MQ - ${this.name}] Channel has been close while message was being processed`);
            return ;
          }
          this.channel.ack(message); // acknowledge to server that msg has been processed
        })
        .catch((err) => {
          this.logger.error(`[MQ - ${this.name}] An error on message from ${this.queueName} queue process ` +
            'unexpectedly happened', message, err);

          if (_.isNull(this.channel)) {
            this.logger.error(`[MQ - ${this.name}] Channel has been close while message was being processed`);
            return ;
          }

          this.channel.nack(message);
        })
      ;
    }, {
      priority: (index % 3),
      consumerTag,
      noAck: false,
    })
      .catch((err) => {
        this.logger.error(`[MQ - ${this.name}] Unable to subscribe to ${this.queueName} queue.`);
        if (!_.isNull(this.channel)) {
          // emitting close event (will try to restart everything)
          this.channel.close();
        }
        return Promise.reject(err);
      })
    ;
  }

  bufferToMessage(message) {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message.content.toString());
    } catch (e) {
      this.logger.error(`[MQ - ${this.name}] This message can't be parsed`);
      throw e;
    }
    this.logger.verbose(`[MQ - ${this.name}] Message received on ${this.queueName} queue`, parsedMessage);
    return parsedMessage;
  }

  stop() {
    if (!this.channel) {
      return Promise.resolve();
    }
    return this.channel.close()
      .then(() => {
        if (!_.isNull(this.timeout)) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.channel = null;
      })
    ;
  }

}
