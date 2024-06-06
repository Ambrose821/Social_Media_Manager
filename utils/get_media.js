const axios = require('axios')
const InstaAccount = require('../models/InstaAccount')
const {edit_image,fix_reddit_video_url,fix_reddit_photo_url} = require("./photo_editor")
const {fixRedditVideoUrl, deleteFile} = require('./media_processing');



const {get_creation_id, post_insta_photo, getStatusOfUploadContainer, insta_post_reel} = require('../utils/insta_assist')

const captions = {
    "culture": `\nFOLLOW FOR DAILY CONTENT🎉 \nROAD TO 1K📈\n No problem! Here’s the information about the Mercedes CLR GTR:\n
    The Mercedes CLR GTR is a remarkable racing car celebrated for its outstanding performance and sleek design. Powered by a potent 6.0-liter V12 engine, it delivers over 600 horsepower.\n
    Acceleration from 0 to 100 km/h takes approximately 3.7 seconds, with a remarkable top speed surpassing 320 km/h.\n
    Incorporating advanced aerodynamic features and cutting-edge stability technologies, the CLR GTR ensures exceptional stability and control, particularly during high-speed maneuvers.\n
    Originally priced around $1.5 million, the Mercedes CLR GTR is considered one of the most exclusive and prestigious racing cars ever produced.\n
    Its limited production run of just five units adds to its rarity, making it highly sought after by racing enthusiasts and collectors worldwide.\n
    .\n
    .\n
    .\n
    .\n
    .\n
    #funny #viral #fyp #humour #memes #viral #daily` ,
    'memes': `\nFOLLOW FOR DAILY CONTENT🎉 \nROAD TO 1K📈\n No problem! Here’s the information about the Mercedes CLR GTR:\n
    The Mercedes CLR GTR is a remarkable racing car celebrated for its outstanding performance and sleek design. Powered by a potent 6.0-liter V12 engine, it delivers over 600 horsepower.\n
    Acceleration from 0 to 100 km/h takes approximately 3.7 seconds, with a remarkable top speed surpassing 320 km/h.\n
    Incorporating advanced aerodynamic features and cutting-edge stability technologies, the CLR GTR ensures exceptional stability and control, particularly during high-speed maneuvers.\n
    Originally priced around $1.5 million, the Mercedes CLR GTR is considered one of the most exclusive and prestigious racing cars ever produced.\n
    Its limited production run of just five units adds to its rarity, making it highly sought after by racing enthusiasts and collectors worldwide.\n
    .\n
    .\n
    .\n
    .\n
    .\n
    #funny #viral #fyp #humour #memes #viral #daily`
}

const get_media = async (genre, quantity, excludeIds =""/*Content to avoid*/ )=>{

    try{
    var response = await axios.post(`https://media-news-api-production.up.railway.app/content_get?&genre=${genre}&quantity=${quantity}`,{excludeIds: excludeIds}, {headers: { 'Content-Type': 'application/json'} } );   
   //console.log(typeof response.data.media[0]._id);
   //console.log(response.data.message)
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

        //console.log(this_account.content_posted);
        var excludeIds = this_account.content_posted;
        


    }catch(err){
        return console.error("Error Identifying account: " + err);
    }
    
    let local_delete_list = []; //Some videos need to be download to the server before being posted. We need to save server space by deleting them once finished
    
    let container_queue = []; //Currently just used for reels, No need to check status of pictures as it is very fast and we dont want to waste requests.
    let underCaption= "";
    switch (genre){
        case "culture":
            underCaption = captions.culture
            break;
        case "memes":
            underCaption = captions.memes
            break;
        case "cringe":
            underCaption = captions.memes
    }
    
        
    const media_arr = await get_media(genre,quantity,excludeIds);
    //console.log(media_arr)
    

    for(let i =0; i < quantity; i++){
    try{
        post = media_arr[i];
       let plane_caption = post.title + underCaption;
       const encodedCaption = encodeURIComponent(plane_caption);
      
        if(!post.video_url && post.img_url){
           var image_url;
           if(genre === 'memes' || genre === 'cringe'){
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
            if(genre === 'memes' || genre === 'cringe'){
                console.log(`Befroe Fix Reddit post.video_url ${post.video_url} and Id: ${post._id}`)
                const fixedUrl = await fixRedditVideoUrl(post.video_url,String(post._id));
                video_url = fixedUrl.video_url //Reddit urls are missing sound and not compatible with meta grpah api by default. this function fixes that.
                console.log("Tryna post video url ; "+ video_url)
                local_path = fixedUrl.local_path
                console.log("memes video or cringe : " + video_url)

                local_delete_list.push(local_path)

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
         //  await insta_post_reel(insta_id,"","","",creation_id_to_post)
         
           if(local_delete_list[i]){
            await deleteFile(local_delete_list[i])
            
           }

            
        }

        
       
    }catch(err){
        console.error("Error posting from creationID queue"+ err);

    }
    console.log("Done Posting")

}



module.exports = {get_media, get_and_insta_post};