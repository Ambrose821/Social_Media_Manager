const axios = require('axios')
const InstaAccount = require('../models/InstaAccount')
const {edit_image,fix_reddit_video_url,fix_reddit_photo_url} = require("./photo_editor")



const {get_creation_id, post_insta_photo, getStatusOfUploadContainer, insta_post_reel} = require('../utils/insta_assist')

const captions = {
    "culture": "\nFOLLOW FOR DAILY CONTENT🎉 \nROAD TO 1K📈 \n.\n.\n.\n.\n #funny #viral #fyp #humour #memes,#daily",
    "memes": "\nFOLLOW FOR DAILY CONTENT🎉 \nROAD TO 1K📈\n.\n.\n.\n #funny #viral #fyp #humour #memes #viral #daily"
}

const get_media = async (genre, quantity, excludeIds =""/*Content to avoid*/ )=>{

    try{
    var response = await axios.post(`https://media-news-api-production.up.railway.app/content_get?&genre=${genre}&quantity=${quantity}`,{excludeIds});   
   //console.log(typeof response.data.media[0]._id);
   console.log(response.data.message)
   return response.data.media;

    }

   

    catch(err){
        console.error("Error getting media: " + err)
       // console.log(JSON.stringify(response))
    }
}


// TODO: This is currently only set up for posts with small captions. memes and reels, etc. will need to impplement longer captions for news and current events
// TODO: This is HORRIBLY structured. Fix please
//TODO: Edit images depending on genre. For news and sports it makes sense to add caption to image. does not work for memes or culture as there is already text
const get_and_insta_post = async(insta_id,genre,quantity) =>{

    try{

        var this_account = await InstaAccount.findOne({instagram_id:insta_id});

        console.log(this_account.content_posted);
        var excludeIds = this_account.content_posted;
        


    }catch(err){
        return console.error("Error Identifying account: " + err);
    }
    
    
    let container_queue = []; //Currently just used for reels, No need to check status of pictures as it is very fast and we dont want to waste requests.
    let underCaption= "";
    switch (genre){
        case "culture":
            underCaption = captions.culture
            break;
        case "memes":
            underCaption = captions.memes
    }
    
        
    const media_arr = await get_media(genre,quantity,excludeIds);
    console.log(media_arr)
    

    for(let i =0; i < quantity; i++){
    try{
        post = media_arr[i];
       let plane_caption = post.title + underCaption;
       const encodedCaption = encodeURIComponent(plane_caption);
      
        if(!post.video_url && post.img_url){
           var image_url;
           if(genre === 'memes'){
            image_url = await fix_reddit_photo_url(post.img_url,post._id);
            console.log("memes photo")

           }
           else{
            image_url = post.img_url;
           }
           post_insta_photo(insta_id,image_url,encodedCaption)
           this_account.content_posted.push(post._id); //Register content posted by this account
           await this_account.save();
           continue;
        }else if(post.video_url){
            var video_url;
            if(genre === 'memes'){
                video_url = await fix_reddit_video_url(post.video_url,post.title._id); //Reddit urls are missing sound and not compatible with meta grpah api by default. this function fixes that.
                console.log("memes video")
            }
            else{video_url = post.video_url}
            const creation_id_to_enqueue = await get_creation_id(insta_id,video_url,plane_caption,"reel")
            container_queue.unshift(creation_id_to_enqueue)
            console.log("Reel enqueued: " + creation_id_to_enqueue )
            this_account.content_posted.push(post._id); //Register content posted by this account
            await this_account.save();
        }else{
            continue;
        }
        

    }catch(err){
        console.error("Problem in loop from  get_and_insta_post\n ERROR: "+err)
        continue;
    }
    }

      //save updates to content posted of this account TODO : This currently does not guaruntee that a given reel is posted. it only strongly implies it.

    try{
        console.log("In Queue: "+container_queue.length)
        const original_length = container_queue.length
    
        for(let i =0; i < original_length; i++){
            creation_id_to_post = container_queue.pop()
            console.log("Dequeued: " + creation_id_to_post)
            console.log("i = : " +i)
            await insta_post_reel(insta_id,"","","",creation_id_to_post)

            
        }
       
    }catch(err){
        console.error("Error posting from creationID queue");

    }
    console.log("Done Posting")

}


module.exports = {get_media, get_and_insta_post};