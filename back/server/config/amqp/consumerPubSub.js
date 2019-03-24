/**
 * ConsumerPubSub
 * 2.3.1
 * exchanges: String or [String]
 * queueName: String
 * logger: winston logger
 * listener: Function
 * name: String (Optional)
 */

import Promise from 'bluebird';
import _ from 'lodash';
import uuid from 'uuid';

export default class ConsumerPubSub {
  constructor(exchanges, queueName, logger, listener, name, connection, bindingKeys) {
    if (!exchanges) {
      throw new Error('[MQ] One or more exchange\'s name are required to connect to MQPubSub');
    }

    if (!queueName) {
      throw new Error('[MQ] An queue name is required to connect to MQPubSub');
    }

    if (!_.isFunction(listener)) {
      throw new Error('[MQ] listener need to be a function');
    }

    if (!_.isArray(bindingKeys)) {
      throw new Error('[MQ] bindingKeys need to be an array');
    }

    this.exchanges = _.compact(_.isArray(exchanges) ? exchanges : [exchanges]);
    this.bindingKeys =  _.compact(_.isArray(bindingKeys) ? bindingKeys : [bindingKeys]);
    this.bindingKeys = _.size(this.bindingKeys) ? this.bindingKeys : [''];
    this.queueName = queueName;
    this.listener = listener;
    this.name = name || uuid();
    this.logger = logger;
    this.channel = null;
    this.isBlocked = false;
    this.isBusy = false;
    this.isClosed = true;
    this.restartTimeout = 5000; // 5s
    this.timeout = null;
    this.connection = connection;
  }

  start() {
    if (!_.isNull(this.timeout)) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    return this.connection.getConnection(this.name)
      // create new channel
      .then((connection) => connection.createChannel())
      // handle channel events
      .then((channel) => this.handleEvents(channel))
      // make sure all exchanges exist and create them otherwise
      .then(() => {
        const assertPromises = _.map(this.exchanges, (exchange) => {
          return this.channel.assertExchange(exchange, 'direct', { durable: true });
        });
        return Promise.all(assertPromises);
      })
      // make sure queue exists and create it otherwise
      // Queue name need to be explicitly set in order to make the queue durable
      // if exclusive is set to true the queue will be deleted once the connection
      // is lost.
      .then(() => this.channel.assertQueue(this.queueName, {exclusive: false, durable: true }))
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
      // function that will be excuted while depiling
      .then(() => this.attachListener())
      .catch(err => {
        this.logger.error(`[MQ - ${this.name}] Error during startup, queue ${this.queueName} ` +
          `to exchanges ${this.exchanges} : ${err.message}`);
      })
    ;
  }

  handleEvents(channel) {
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

    this.channel.on('drain', () => {
      this.logger.warn(`[MQ - ${this.name}] The  channel is no more busy, thank you for your patience`);
      this.isBusy = false;
    });
  }

  attachListener() {
    return this.channel.consume(this.queueName, (message) => {
      if (_.isNull(message)) {
        // legacy, not sure how this would happen...
        this.logger.warn(`[MQ - ${this.name}] This consumer (${this.name}) has ` +
        `been cancelled from ${this.queueName} queue`);
        return;
      }

      const parsedMessage = this.bufferToMessage(message);
      return this.listener(parsedMessage, message)
        .then(() => {
          this.logger.verbose(`[MQ - ${this.name}] Message from queue: "${this.queueName}" queue, ` +
            `has successfully been processed. Routing key: ${message.fields.routingKey}`, parsedMessage);
        })
        .catch((err) => {
          this.logger.error(`[MQ - ${this.name}] An error on message from ${this.queueName} queue process ` +
            'unexpectedly happened', err);
        })
      ;
    }, {noAck: true});
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
