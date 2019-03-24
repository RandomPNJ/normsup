/**
 * repositories
 * 2.0.3
 */

import _ from 'lodash';
import path from 'path';
import Joi from 'joi';

const defaults = {
  repositoriesRoot: __dirname,
  customPath: './components/<%=repositoryName%>/<%=repositoryName%>.repository',
};

const OptionsSchema = Joi.object().keys({
  repositoriesRoot: Joi.string().optional(),
  customPath: Joi.string().optional(),
});

const RepositoryConfigSchema = Joi.object().keys({
  db: Joi.string().required(),
  collection: Joi.string().optional(),
  customPath: Joi.string().optional(),
  aliases: Joi.array().optional().items(Joi.string()),
});

export default function initRepositories(app, repositoriesConfig, localOptions = {}) {
  Joi.assert(localOptions, OptionsSchema);
  const options = _.defaults(localOptions, defaults);

  _.forEach(repositoriesConfig, (repositoryConfig, repositoryName) => {
    Joi.assert(repositoryConfig, RepositoryConfigSchema);
    _.set(repositoryConfig, 'name', repositoryName);

    let repositorysDB;

    let db;
    try {
      db = app.get(repositoryConfig.db, { noCheck: true });
    } catch (e) {
      throw new Error(`Unable to find database "${repositoryConfig.db}" for repository "${repositoryName}"`);
    }

    if (repositoryConfig.collection) {
      const collection = _.get(db.db, repositoryConfig.collection);
      if (!collection) {
        throw new Error(`Unable to find collection "${repositoryConfig.collection}" on db "${repositoryConfig.db}" ` +
          `for repository "${repositoryName}"`);
      }

      repositorysDB = collection;
    } else {
      repositorysDB = db;
    }

    const customPath = _.template(repositoryConfig.customPath || options.customPath);
    let RepositoryClass;
    try {
      RepositoryClass = require(path.join(options.repositoriesRoot, customPath({
        repositoryName,
      }))).default;
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }

      // default repository to access db, depending on db
      RepositoryClass = db.repository;
    }

    app.set(`repository:${repositoryName}`, new RepositoryClass(
      repositoryConfig,
      repositorysDB,
      db.repositoryData
    ), {
      aliases: repositoryConfig.aliases,
    });
  });
}
