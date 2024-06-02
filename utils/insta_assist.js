const axios = require('axios');
const { response } = require('express');
// const date_since_starting = require('./utils/dayCounter')
// const daily1_caption = require('./default_captions/captions')

//takes a facebook page id and returns the instagram id that is linked to the page
const page_connect =  async(page_id) =>{
    const url = `https://graph.facebook.com/v10.0/${page_id}?fields=instagram_business_account&access_token=${process.env.CURRENT_LONG_TOKEN}`
    try{
   
       const response = await axios.get(url)
       //console.log(response.data)
       const insta_id = response.data.instagram_business_account.id;
      console.log(insta_id);
       return insta_id;
        
    }catch(err){
        console.log(err)
    }
   }

const get_creation_id = async (insta_id, media_url,caption,content_type ="") =>{
    if(content_type == "reel"){
   
      var url = `https://graph.facebook.com/v19.0/${encodeURIComponent(insta_id)}/media?media_type=REELS&video_url=${encodeURIComponent(media_url)}&caption=${encodeURIComponent(caption)}&access_token=${encodeURIComponent(process.env.CURRENT_LONG_TOKEN)}`;


  
       
    }
    else{
        var url =`https://graph.facebook.com/v19.0/${insta_id}/media?image_url=${media_url}&caption=${caption}&access_token=${process.env.CURRENT_LONG_TOKEN}`
    }
   
    const response = await axios.post(url)
    //console.log(response.data)
    const creation_id = response.data.id;
    console.log("At creation ID: " + JSON.stringify(response.data))
    return creation_id;

    

}   
//Dont use this, use getStatusOfUploadContainer
const get_insta_creation_id_status = async (creation_id) => {
    try{
        const url = `https://graph.facebook.com/v19.0/${creation_id}?fields=status_code,status&access_token=${process.env.CURRENT_LONG_TOKEN}`

        const response = await axios.get(url);
       // console.log(response.data)}
        
}catch(err){
    console.log(err)
}

}


const getStatusOfUploadContainer = async (accessToken, igContainerId) => {
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${igContainerId}`,
      { params: { access_token: accessToken, fields: 'status_code,error' } }
    );
    if(response.data.error){
      console.log(response.data.error)
    }
        console.log(response.data.status_code)
    return response.data.status_code;
  };



//This is seperate from the creation_id function because i believe i'll need a different procedure for different types of posts EX)videos, reels, stories, etc
const post_insta_photo = async(insta_id, media_url,caption,content_type) =>{
  try{
   const creation_id = await get_creation_id(insta_id, media_url,caption,"")
    console.log(creation_id);
    //return creation_id
    const url = `https://graph.facebook.com/v19.0/${insta_id}/media_publish?creation_id=${creation_id}&access_token=${process.env.CURRENT_LONG_TOKEN}`
    const response = await axios.post(url);
    console.log(response.data)
  }catch(err){
    console.error("Error Posting photo: " + err)
  }
}



//TODO Need better logic for while loop becaue we use too many requests
const insta_post_reel = async(insta_id, media_url="", captions="", content_type="",creation_id ="") =>{


  try{
  if(!creation_id){
    if(!insta_id || !media_url || !captions || !content_type){
      return(console.log("Incorrect Argument option. \n If you do not have creation id you must have all other arguments.\n Instagram ID is required in every case"))
    }
    creation_id = await get_creation_id(insta_id, media_url,captions, content_type)
  }

    console.log("creation_id"+creation_id)
    
    var status = null
    var counter =0
    var start_time = Date.now()

    while(status != "FINISHED"){
      if(Date.now()-start_time > (1000*60*10)){
        return console.error("Upload aborted. Took longer than 5 minutes")
      }
        
        status =  await getStatusOfUploadContainer(process.env.CURRENT_LONG_TOKEN, creation_id);
        console.log("Checked"+  ++counter)
        if(status == "FINISHED"){
          console.log("ready")
          await generic_insta_post(insta_id,creation_id)
          break;
        }

        if(status == "ERROR"){
          console.log("Error in container, skipping: ")
          break;
        }
    
        
        await new Promise((p) =>setTimeout(p,10000))
    }
    
    
    

    
    }catch(err){

      console.log("Error Posting Reel +:  "+ err)
    }
}


  
const generic_insta_post = async(insta_id,creation_id) =>{
  return new Promise(async (resolve, reject) =>{

   try{ 
  const url = `https://graph.facebook.com/v19.0/${insta_id}/media_publish?creation_id=${creation_id}&access_token=${process.env.CURRENT_LONG_TOKEN}`
  const response = await axios.post(url);
  console.log("Generic Post Success: "+ JSON.stringify(response.data))
  resolve()
   }catch(err){
    console.error("Genereic Posting Error");
    reject(err)

   }
  })  
}
 //Not currently userd. using get_creation_id instead
const uploadReelsToContainer = async (
    accessToken,
    instagramAccountId,
    caption,
    videoUrl,
    coverUrl
  ) => {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${instagramAccountId}/media`,
      {
        access_token: accessToken,
        caption,
        media_type: 'REELS',
        video_url: videoUrl,
        cover_url: coverUrl,
      }
    );
   
    return response.data;
  };
//url: https://politicsnigeria.com/wp-content/uploads/2024/02/philip-shaibu.jpg
//caption "Edo deputy gov raises alarm, says there are plans to impeach him over controversial PDP primary"
module.exports = {page_connect, get_creation_id, post_insta_photo,get_insta_creation_id_status, uploadReelsToContainer, getStatusOfUploadContainer, insta_post_reel};