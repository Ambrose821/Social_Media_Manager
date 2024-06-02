const axios = require ('axios')

/*THIS IS A FUNCTION USED TO GAIN ACCESS TO INSTAGRAM GRAPH API 60 DAY KEY. ONLY CALL IF NECESSARY AT THE 60 DAY EXPIREY*/ 
//request 60 day access token fro Graph API
const sixty_graph_key = async (short_token) => {
    //const url = `https://graph.facebook.com/{graph-api-version}/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.INSTA_APP_ID}&client_secret=${process.env.INSTA_APP_SECRET}&fb_exchange_token=${process.env.SHORT_GRAPH_API_KEY}`
    const url = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.INSTA_APP_ID}&client_secret=${process.env.INSTA_APP_SECRET}&fb_exchange_token=${short_token}`
    try{
       
      var  response = await axios.get(url)
        
    console.log(response.data.access_token)
    return({token: response.data.access_token, timer: response.data.expires_in})
    
    }
    catch(err){
        console.log(JSON.stringify(response))
        console.log(err)
    }
}


module.exports = sixty_graph_key;