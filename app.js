const express = require('express');
const dotenv = require('dotenv');
const path = require('path')

//Allows use of process.env.{variable_name}
dotenv.config({path: './config/config.env'})

//port
const PORT = process.env.PORT || 5000;

//if you need a new 60 day API instagram graph access key
const sixty_graph_key = require('./config/insta_access')
//const key_and_timer = sixty_graph_key(process.env.SHORT_GRAPH_API_KEY)
// use settimeout to notify me when the key is gonna expire


const {page_connect, get_creation_id, post_insta_photo ,get_insta_creation_id_status, uploadReelsToContainer, getStatusOfUploadContainer } = require('./utils/insta_assist')

//If you need to get the instagram id for env variables look down
//page_connect(process.env.SHUFFLE_MEDIA_FACEBOOK_ID)

//test getting creation id
//get_creation_id(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://politicsnigeria.com/wp-content/uploads/2024/02/philip-shaibu.jpg','Edo deputy gov raises alarm, says there are plans to impeach him over controversial PDP primary')

//drumroll please...

const tester = async() =>{
var creation_id = await post_insta_photo(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://img-9gag-fun.9cache.com/photo/aBdq5X1_460sv.mp4','Hello World', "reel")


var status = getStatusOfUploadContainer(process.env.CURRENT_LONG_TOKEN,  creation_id)
var counter =1
while(status != "FINISHED"){
    status =  await getStatusOfUploadContainer(process.env.CURRENT_LONG_TOKEN, creation_id);

    console.log("Checked"+  ++counter)
}
console.log("ready")
}

// /post_insta_photo(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://politicsnigeria.com/wp-content/uploads/2024/02/philip-shaibu.jpg','Hello World',)
//
tester()

//var creation_id =  post_insta_photo(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://img-9gag-fun.9cache.com/photo/aBdq5X1_460sv.mp4','Hello World', "reel")


var status = getStatusOfUploadContainer(process.env.CURRENT_LONG_TOKEN, '18023004295891477')
//get_insta_creation_id_status(creation_id)
const app = new express()

app.use(express.urlencoded({extended:false}))
app.use(express.json);

app.listen(PORT,console.log(`Server running on ${process.env.PORT}`))

