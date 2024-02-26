const express = require('express');
const dotenv = require('dotenv');
const path = require('path')

//Allows use of process.env.{variable_name}
dotenv.config({path: './config/config.env'})

//port
const PORT = process.env.PORT || 5000;

const sixty_graph_key = require('./config/insta_access_token')
//const key_and_timer = sixty_graph_key(process.env.SHORT_GRAPH_API_KEY)
// use settimeout to notify me when the key is gonna expire


const app = new express()
sixty_graph_key();
app.use(express.urlencoded({extended:false}))
app.use(express.json);

app.listen(PORT,console.log(`Server running on ${process.env.PORT}`))

