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
const get_and_insta_post = async(insta_id,genre,quantity) =>{

    
    
    let container_queue = []; //Currently just used for reels, No need to check status of pictures as it is very fast and we dont want to waste requests.
    let underCaption= "";
    switch (genre){
        case "culture":
            underCaption = captions.culture
    }
    
        
    const media_arr = await get_media(genre,quantity);
    console.log(media_arr)

    for(let i =0; i < quantity; i++){
    try{
        post = media_arr[i];
       let plane_caption = post.title + underCaption;
       const encodedCaption = encodeURIComponent(plane_caption);
      
        if(!post.video_url){
           // post_insta_photo(insta_id,post.img_url,encodedCaption)
           continue;
        }else if(post.video_url){
            const creation_id_to_enqueue = await get_creation_id(insta_id,post.video_url,plane_caption,"reel")
            container_queue.unshift(creation_id_to_enqueue)
            console.log("Reel enqueued: " + creation_id_to_enqueue )
        }

    }catch(err){
        console.error("Problem in loop from  get_and_insta_post\n ERROR: "+err)
    }
    }

    try{
        console.log("In Queue: "+container_queue.length)
        const original_length = container_queue.length
    
        for(let i =0; i < original_length; i++){
            creation_id_to_post = container_queue.pop()
            console.log("Dequeued: " + creation_id_to_post)
            console.log("i = : " +i)
            //await insta_post_reel(insta_id,"","","",creation_id_to_post)
            
        }
       
    }catch(err){
        console.error("Error posting from creationID queue");

    }
    console.log("Done Posting")

}


module.exports = {get_media, get_and_insta_post};