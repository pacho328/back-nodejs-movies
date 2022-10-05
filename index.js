'use strict'

var mongoose = require("mongoose");
var app = require("./app")
var port = 3900

mongoose.set('useFindAndModify',false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/backend', {useNewUrlParser: true,useUnifiedTopology: true})
        .then(() =>{
            // crear servidor y escuchar
            app.listen(port,() =>{
                console.log("Escuchando por: http://localhost:"+port);
            } )
        })
