'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/crawl/start',controller.crawler.crawl);
  router.get('/crawl/api',controller.crawler.fetchApi);
};
