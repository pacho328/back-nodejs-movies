'use strict'

//cargar modulos para crear servidor
var express = require('express');
var bodyParser = require('body-parser');
// Ejecutar express
var app = express()
// cargar ficheros de rutas
var article_routes = require('./routes/articles')
// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS recibir peticiones de frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Añadir pefijos a rutas
app.use('/api',article_routes);
//Exportar modulo
module.exports =app;
