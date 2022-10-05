'use strict'

var express = require('express');
var ArticleController = require('../controllers/articles');
var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './upload/articles'})

router.post('/datos',ArticleController.datosCurso);
router.get('/test',ArticleController.test);
router.post('/save',ArticleController.save);
router.get('/getArticles/:last?',ArticleController.getArticles);
router.get('/getArticle/:id',ArticleController.getArticle);
router.put('/getArticle/:id',ArticleController.update);
router.delete('/article/:id',ArticleController.delete);
router.post('/uploadimage/:id?',md_upload ,ArticleController.upload);
router.get('/getimage/:image',ArticleController.getImage);
router.get('/search/:search',ArticleController.search);

module.exports = router;
