'use strict'
var validator = require('validator');
var Article = require('../models/articles');
var path = require('path');
var fs = require('fs');
var controller = {
    datosCurso: (req,res)=>{

        return res.status(200).send({
            curso: "jooal",
            autor: "amar",
            url: "voy",

        })

    },
    test: (req,res)=>{

        return res.status(200).send({
            message: "test",

        })

    },
    save: (req,res)=>{

        var params = req.body;
        try{
          var validate_title = !validator.isEmpty(params.title);
          var validate_content = !validator.isEmpty(params.content);
        }catch(err){
          return res.status(200).send({
            status: "error",
            message: "faltan datos"
          })
        }
        if(validate_title && validate_content ){
          var article = new Article();
          article.title = params.title;
          article.content = params.content;
          if(params.image){
            article.image = params.image;
          }else{
            article.image = null;
          }
          article.save((err, articleStored)=>{
            if(err || !articleStored){
              return res.status(404).send({
                status: "error",
                message: "error guardando"
              })
            }
            return res.status(200).send({
              status: 'success',
              article: articleStored
            })
          });

        }else{
          return res.status(200).send({
            status: "error",
            message: "datos no son validos"
          })
        }
    },
    getArticles: (req,res) =>{
      var query = Article.find({})
      var last = req.params.last;
      if(last || last != undefined){
        query.limit(1);
      }
      query.sort('-_id').exec((err,articles)=>{
        if(err){
          return res.status(404).send({
            status: "error",
            message: "error buscando datos"
          })
        }
        if(!articles){
          return res.status(404).send({
            status: "error",
            message: "no hay articulos"
          })
        }
        return res.status(200).send({
          status: "success",
          articles
        })
      })

    },
    getArticle: (req,res) =>{
      var id = req.params.id;
      if(!id || id == undefined || id == null){
        return res.status(404).send({
          status: "error",
          message: "id no definido"
        });
      }
      Article.findById(id,(err, article)=>{
        if(err){
          return res.status(500).send({
            status: "error",
            message: "error buscando el datos"
          })
        }
        if(!article){
          return res.status(404).send({
            status: "error",
            message: "no esta el articulo"
          })
        }
        return res.status(200).send({
          status: "success",
          article
        });
      });
    },
    update: (req,res)=>{
      var id = req.params.id;
      var params = req.body;
      if(!id || id == undefined || id == null){
        return res.status(404).send({
          status: "error",
          message: "id no definido"
        });
      }

      try{
        var validate_title = !validator.isEmpty(params.title);
        var validate_content = !validator.isEmpty(params.content);
      }catch(err){
        return res.status(200).send({
          status: "error",
          message: "error validando datos"
        })
      }
      if(validate_title && validate_content ){
        Article.findOneAndUpdate({_id:id}, params,{new:true},(err, articleUpdated) => {
          if(err){
            return res.status(500).send({
              status: "error",
              message: "error actulizando"
            });
          }
          if(!articleUpdated){
            return res.status(404).send({
              status: "error",
              message: "no exite el articulo"
            });
          }
          return res.status(200).send({
            status: "success",
            article: articleUpdated
          });
        });
      }else {
        if(!id || id == undefined || id == null){
          return res.status(404).send({
            status: "error",
            message: "validacion no es correcta"
          });
        }
      }
    },
    delete: (req,res)=>{
      var id = req.params.id;
      Article.findOneAndDelete({_id: id},(err,articleRemoved)=>{
        if(err){
          return res.status(500).send({
            status: "error",
            message: "error al borrar"
          });
        }
        if(!articleRemoved){
          return res.status(404).send({
            status: "error",
            message: "no esta el articulo"
          });
        }
        return res.status(200).send({
          status: "success",
          article: articleRemoved
        });
      })
    },
    upload: (req,res) =>{
      // configurar el modulo  connect multiparty router/article.js
      // Recoger el fichero de la peticiones
      var file_tem = 'filetem';
      if(!req.files){
        return res.status(404).send({
          status: "error",
          message: file_tem
        });
      }

      //conseguir nombre y la extension de article
      var file_path = req.files.file0.path;
      var file_split = file_path.split("/")[2];
      var ext_file = file_split.split("\.")[1];
      // comprobar extencosion
      if(ext_file!="jpg" && ext_file!="png" ){
        console.log(ext_file);
        fs.unlink(file_path , (err) =>{
          if(err){
            return res.status(404).send({
              status: "error",
              message: "extension no valida y al borrar el archivo"
            });
          }
        } )
        return res.status(404).send({
          status: "error",
          message: "extension no valida"
        });
      }else{
        //validator
        // buscar articulo y asignar
        var articleId = req.params.id;
        if(articleId){
          Article.findOneAndUpdate({_id:req.params.id},{image:file_split},{new:true},(err,articleN)=>{
            if(err || !articleN){
              return res.status(404).send({
                status: "error",
                message: "no se encontro el archivo"
              });
            }
            return res.status(200).send({
              status: "success",
              article: articleN
            });
          })
        }else{
          return res.status(200).send({
            status: "success",
            image: file_split
          });
        }
      }
    },
    getImage : (req,res)=>{
      var nameImage = req.params.image;
      var path_file = './upload/articles/'+nameImage;
      fs.exists(path_file,(exists)=>{
        if(exists){
          return res.sendFile(path.resolve(path_file))
        }else{
          return res.status(404).send({
            status: "error",
            message: 'la imagen no exites'
          });
        }
      });
    },
    search: (req,res)=>{
      var searchStrin = req.params.search;
      Article.find({
        '$or': [
          {'title':{'$regex': searchStrin, '$options': 'i'}},
          {'content':{'$regex': searchStrin, '$options': 'i'}}
        ]
      }).sort([['date','descending']]).exec((err, articles)=>{
        if(err || articles.length <= 0){
          return res.status(404).send({
            status: "error",
            message: "no se encontro: "+searchStrin
          });
        }
        return res.status(200).send({
          status: "success",
          articles
        });
      });

    }
}

module.exports = controller;
