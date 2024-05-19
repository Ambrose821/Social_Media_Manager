const express = require('express');
const dotenv = require('dotenv');
const path = require('path')

const connectDB = require('./config/connectDb');

//Allows use of process.env.{variable_name}
dotenv.config({path: './config/config.env'})



//port
const PORT = process.env.PORT || 5000;

//if you need a new 60 day API instagram graph access key
//const sixty_graph_key = require('./config/insta_access')
// const key_and_timer = sixty_graph_key(process.env.SHORT_GRAPH_API_KEY)
// use settimeout to notify me when the key is gonna expire


const {page_connect, get_creation_id, post_insta_photo ,get_insta_creation_id_status, uploadReelsToContainer, getStatusOfUploadContainer, insta_post, insta_post_reel } = require('./utils/insta_assist')

const date_since_starting = require('./utils/dayCounter')
const daily1_caption = require('./default_captions/captions')






/*===================Daily1 Beninging======================*/
const daily1 = async() =>{
 const caption = daily1_caption(date_since_starting('2024-03-19'))
 //Captions MUST be urlencoded to make sense in the query
 const encodedCaption = encodeURIComponent(caption);
 console.log(caption)
console.log(encodedCaption)
insta_post_reel(process.env.DAILY1_INSTA_ID,'https://socialmediamanager-production.up.railway.app/videos/daily1.mp4',caption,"reel")
}
//daily1();
//setInterval(daily1,1000*60*60*24);

//Connection to Media API
const {get_media,get_and_insta_post} = require('./utils/get_media')
//Post 3 things
//get_and_insta_post(process.env.DAILY1_INSTA_ID,"culture",10);


const {createInstagramImage, edit_image} = require('./utils/photo_editor');
// Replace 'your-image-url' with the actual URL of the image you want to use
//createInstagramImage("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg");
// edit_image();


//var creation_id =  post_insta_photo(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://img-9gag-fun.9cache.com/photo/aBdq5X1_460sv.mp4',encodedCaption, "reel")

    
    

// const tester = async() =>{
//     const creation_id = await get_creation_id(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://img-9gag-fun.9cache.com/photo/aQEwK8e_460sv.mp4','Hello World', "reel")
//     console.log(creation_id)
//     var counter = 0
//     var status = getStatusOfUploadContainer(process.env.CURRENT_LONG_TOKEN,  creation_id)
//     while(status != "FINISHED"){
//         console.log("Checked"+  ++counter)
//         status = await getStatusOfUploadContainer(process.env.CURRENT_LONG_TOKEN,  creation_id)
//         if(status == "FINISHED"){
//             break;
//         }
        
//         await new Promise((p) =>setTimeout(p,10000))
//     }
//     console.log("ready")
//     await post_insta_photo(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID,creation_id)
    
//     }
// tester()


//If you need to get the instagram id for env variables look down
//page_connect(process.env.SHUFFLE_MEDIA_FACEBOOK_ID)

//test getting creation id
//get_creation_id(process.env., 'https://politicsnigeria.com/wp-content/uploads/2024/02/philip-shaibu.jpg','Edo deputy gov raises alarm, says there are plans to impeach him over controversial PDP primary')

//drumroll please...

//post_insta_photo(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://politicsnigeria.com/wp-content/uploads/2024/02/philip-shaibu.jpg','Hello World',)
//

//var creation_id =  post_insta_photo(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID, 'https://img-9gag-fun.9cache.com/photo/aBdq5X1_460sv.mp4','Hello World', "reel")


//get_insta_creation_id_status(creation_id)
const app = new express()

//connect to Mongo
connectDB();

const add_insta_account = require('./utils/add_account');

//add_insta_account(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID,"Shuffle Media")
get_and_insta_post(process.env.SHUFFLE_MEDIA_INSTAGRAM_ID,"culture",3);






//page_connect(process.env.DAILY1_FACEBOOK_ID)

// Serve static files from the 'public' directory
app.use(express.static('public'));


app.use(express.urlencoded({extended:false}))
app.use(express.json);

app.listen(PORT,console.log(`Server running on ${process.env.PORT}`))

