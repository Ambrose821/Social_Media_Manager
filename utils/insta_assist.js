const axios = require('axios');

//takes a facebook page id and returns the instagram id that is linked to the page
const page_connect =  async(page_id) =>{
    const url = `https://graph.facebook.com/v10.0/${page_id}?fields=instagram_business_account&access_token=${process.env.CURRENT_LONG_TOKEN}`
    try{
   
       const response = await axios.get(url)
       //console.log(response.data)
       const insta_id = response.data.instagram_business_account.id;
      //console.log(insta_id);
       return insta_id;
        
    }catch(err){
   
    }
   }

const get_creation_id = async (insta_id, img_url,caption) =>{
    const url =`https://graph.facebook.com/v10.0/${insta_id}/media?image_url=${img_url}&caption=${caption}&access_token=${process.env.CURRENT_LONG_TOKEN}`
    const response = await axios.post(url)
    //console.log(response.data)
    const creation_id = response.data.id;
    //console.log(creation_id);
    //console.log(typeof creation_id);
    return creation_id;

}   
//This is seperate from the creation_id function because i believe i'll need a different procedure for different types of posts EX)videos, reels, stories, etc
const post_insta_photo = async(insta_id, img_url,caption) =>{
    const creation_id = await get_creation_id(insta_id, img_url,caption)

    const url = `https://graph.facebook.com/v10.0/${insta_id}/media_publish?creation_id=${creation_id}&access_token=${process.env.CURRENT_LONG_TOKEN}`
    const response = await axios.post(url);
    console.log(response.data)

}


//url: https://politicsnigeria.com/wp-content/uploads/2024/02/philip-shaibu.jpg
//caption "Edo deputy gov raises alarm, says there are plans to impeach him over controversial PDP primary"
module.exports = {page_connect, get_creation_id, post_insta_photo};