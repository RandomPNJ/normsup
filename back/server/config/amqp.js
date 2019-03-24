/**
 * amqp example
 * 1.1.0
 */

import _ from 'lodash';

import AmqpConnection from './amqp/connection';
import ProducerPubSub from './amqp/producerPubSub';
import ConsumerPubSub from './amqp/consumerPubSub';
import YYYWorkerListener from '../components/YYYworker';

/*
** Creates a unique connection to rabbit server that will be shared amongst channels
** - mqConnection
*/
export function startMQConnection(app, logger = loggerT) {
  if (!app) {
    return Promise.reject(new Error('app is undefined'));
  }

  if (app.get('config').EVA_GARE) {
    return Promise.resolve('amqp will no be started in eva gare');
  }

  let mqConnection;
  if (!app.has('mq:connection')) {
    try {
      mqConnection = new AmqpConnection(app.get('config').amqp, logger);
      app.set('mq:connection', mqConnection, { onLoad: true });
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    mqConnection = app.get('mq:connection');
  }

  return mqConnection.start();
}

export function stopMQConnection(app) {
  if (!app || !app.has('mq:connection')) {
    return Promise.resolve();
  }

  return app.get('mq:connection').stop()
    .then(() => {
      app.unset('mq:connection');
    })
  ;
}

/*
** Create all MQ Producers
** They do not need to be started since they create a new Channel on each request
*/
export function startMQProducers(app, logger) {
  if (!app) {
    return Promise.reject(new Error('app is undefined'));
  }

  if (app.get('config').EVA_GARE) {
    return Promise.resolve('amqp will no be started in eva gare');
  }

  if (!app.has('mq:connection')) {
    return Promise.reject(new Error('mq:connection is undefined'));
  }

  if (!app.has('mq:XXX')) {
    try {
      app.set('mq:XXX', new ProducerPubSub(
        app.get('config').amqp.exchanges.XXX,
        logger,
        'Producer XXX',
        app.get('mq:connection')
      ), { onLoad: true });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return Promise.resolve();
}

export function stopMQProducers(app) {
  if (!app) {
    return Promise.resolve('app is undefined');
  }

  if (app.has('mq:XXX')) {
    app.unset('mq:XXX');
  }

  return Promise.resolve('MQ Producers have been deleted');
}

/*
** Create all MQ Consumers
*/
export function startMQConsumers(app, logger) {
  if (!app) {
    return Promise.reject(new Error('app is undefined'));
  }

  if (app.get('config').EVA_GARE) {
    return Promise.resolve('amqp will no be started in eva gare');
  }

  if (!app.has('mq:connection')) {
    return Promise.reject(new Error('mq:connection is undefined'));
  }

  let mqYYY;
  if (!app.has('mq:YYY')) {
    try {
      const config = app.get('config');
      mqYYY = new ConsumerPubSub(
        config.amqp.exchanges.NOM_EXCHANGE_YYY.exchangeName,
        config.amqp.exchanges.NOM_EXCHANGE_YYY.queueName,
        logger,
        YYYWorkerListener,
        'Consumer YYY',
        app.get('mq:connection')
      );
      app.set('mq:YYY', mqYYY, { onLoad: true });
    } catch (e) {
      return Promise.reject(e);
    }
  } else {
    mqYYY = app.get('mq:YYY');
  }

  return mqYYY.start()
    .tapCatch(err => logger.error(`[APP] Error while starting workers: ${err.message}`, err))
  ;
}

export function stopMQConsumers(app) {
  if (!app || !app.has('mq:YYY')) {
    return Promise.resolve();
  }

  return app.get('mq:YYY').stop()
    .then(() => {
      app.unset('mq:YYY');
    })
  ;
}


/*
** Start all MQs
** Be mindful of the order:
** - connection needs to be first
** - Workers will create notifications so they need to be last
*/
export function startAllMQ(app, logger = loggerT) {
  if (!app) {
    return Promise.reject(new Error('app is undefined'));
  }

  if (app.get('config').EVA_GARE) {
    return Promise.resolve();
  }

  return startMQConnection(app, logger)
    .then(_.partial(startMQProducers, app, logger))
  ;
}

/*
** Start all MQs
** Be mindful of the order: need to be inverse of start !
*/
export function stopAllMQ(app) {
  if (!app) {
    return Promise.reject(new Error('app is undefined'));
  }

  if (app.get('config').EVA_GARE) {
    return Promise.resolve('no MQ to stop in eva gare');
  }

  return stopMQProducers(app)
    .then(_.partial(stopMQConnection, app))
  ;
}
