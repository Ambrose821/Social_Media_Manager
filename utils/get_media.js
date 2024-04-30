const axios = require('axios')

const get_media = async (genre, quantity)=>{

    try{
    const response = await axios.get(`https://media-news-api-production.up.railway.app/content_get?&genre=${genre}&quantity=${quantity}`)   
    console.log(response.data[0]);
    }

    catch(err){
        console.err("Error getting media: " + err)
    }
}

module.exports = get_media