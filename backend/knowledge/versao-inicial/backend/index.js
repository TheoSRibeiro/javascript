const app = require("express")() //app representa a instancia do express
const consign = require('consign') //ajudar na gerencia das dependencias
const db = require('./config/db')
const mongoose = require('mongoose')
require('./config/mongodb')


app.db = db // passo as configuracoes do knex, ja configurado para o DB do app
app.mongoose = mongoose

consign()
    .include('./config/passport.js') //carregar para autenticar
    .then('./config/middlewares.js') //vai ser carregado esse arquivo pelo consign
    .then('./api/validation.js')//tem q carregar o validation antes da api do user
    .then('./api') // vai ser carregado todos os arquivos da pasta api pelo consign
    .then('./schedule') //carregar todos os arquivos dentro da pasta schedule
    .then('./config/routes.js') //so le as rotas depois de carregar a api para ter acesso
    .into(app) //injetar em cada dependencia como parametro o app criado


app.listen(3000,() => console.log('Backend executando...'))