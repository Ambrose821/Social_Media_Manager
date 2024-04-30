const axios = require('axios')

const {get_creation_id, post_insta_photo, getStatusOfUploadContainer, insta_post_reel} = require('../utils/insta_assist')

const captions = {
    "culture": "\n.\n.\n.\n.\n #funny #viral #fyp #humour #memes"
}

const get_media = async (genre, quantity)=>{

    try{
    const response = await axios.get(`https://media-news-api-production.up.railway.app/content_get?&genre=${genre}&quantity=${quantity}`)   
   // console.log(response.data.media[0]);
    return response.data.media;

    }

   

    catch(err){
        console.err("Error getting media: " + err)
    }
}


// TODO: This is currently only set up for posts with small captions. memes and reels, etc. will need to impplement longer captions for news and current events
const get_and_insta_post = async(insta_id,genre,quantiy) =>{
    let container_queue = []; //Currently just used for reels, No need to check status of pictures as it is very fast and we dont want to waste requests.
    let underCaption= "";
    switch (genre){
        case "culture":
            underCaption = captions.culture
    }
    
        
    const media_arr = await get_media(genre,quantity);

    for(let i =0; i < quantiy; i++){
        post = media_arr[i];
       let plane_caption = post.title + underCaption;
       let encodedCaption = encodeURIComponent(plane_caption)
        if(post.video_url == null){
            post_insta_photo(insta_id,post.img_url,encodedCaption)
        }else if(post.video_url != null){
            container_queue.unshift(get_creation_id)
        }


        

    }


}


module.exports = get_media;