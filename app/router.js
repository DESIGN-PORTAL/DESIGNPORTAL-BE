'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/font/all', controller.font.all);
  router.get('/font/list', controller.font.list);
  router.post('/font/add', controller.font.add);
  router.post('/font/extract', controller.font.extract);
  router.post('/font/extractBatch', controller.font.extractBatch);


  router.get('/music/list', controller.music.list);
  router.post('/music/add', controller.music.add);
  // router.get('/music/all', controller.music.all);

  router.post('/file/uploadResource', controller.file.uploadResource);
  router.post('/file/upload', controller.file.upload);
  router.post('/file/list', controller.file.list);

  router.get('/project/getOne', controller.project.getOne);
  router.get('/project/list', controller.project.list);
  router.post('/project/save', controller.project.save);
  router.post('/project/edit', controller.project.edit);
};
