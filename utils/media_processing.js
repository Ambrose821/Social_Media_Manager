const fs = require('fs')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg');
const configUrl = require('../config/configUrl')



const downloadFile = async (url, downloadPath) =>{
    console.log("starting download")
    const writer = fs.createWriteStream(downloadPath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'    })

    response.data.pipe(writer);

    return  new Promise((resolve,reject) =>{
        writer.on('finish',resolve);
        writer.on('error',reject)
    })

}

const deleteFile = (path) => {
    return new Promise((resolve,reject) =>{
        fs.unlink(path,(err)=>{
            if(err){
                reject(err)
            }else{
                console.log(path + " Deleted")
                resolve()
            }
        })
    })
} 


//Keeping this as an alt incase. Not currently robust
const fixRedditVideoUrlBad = async (bad_url,title) =>{
    try{

        return new Promise
        var audio = bad_url.replace(/DASH_\d+/, 'DASH_AUDIO_128')
        var outputPath = `./public/videos/${title}_merged.mp4`
        var local_path;
        var video_url;
        ffmpeg().input(bad_url)
        .input(audio)
        .outputOptions('-c:v copy')
        .outputOptions('-c:a aac')
        .save(outputPath)
        .on('end', async() =>{
            console.log("Merge video saved at " + outputPath);
            local_path =  `/videos/${title}_merged.mp4`;
            video_url= 'https://socialmediamanager-production.up.railway.app' + local_path;

        
        }).on('error', async (err) =>{
            if(err.message.includes('343616999')){
                await downloadFile(bad_url,outputPath)
                console.log("fixRedditUrl: no corresponding Audio for this video")
                local_path = `/videos/${title}_merged.mp4`
                video_url = 'https://socialmediamanager-production.up.railway.app' + local_path;
                return({video_url: video_url, local_path: outputPath})
            }else{
               
                reject("Error in fixRedditVideoUrl ffmpeg error callback: "+ err)
            }
            
        })
        return({video_url: video_url, local_path: outputPath})
    

    }catch(err){
        console.error('Error with ffmpeg fixing reddit_url: ' + err)
  
}
}


//Working, Robust and in use methpd
const fixRedditVideoUrll = async (bad_url,title) =>{
    try{
        var audio = bad_url.replace(/DASH_\d+/, 'DASH_AUDIO_128')
        var outputPath = `./public/videos/${title}_merged.mp4`
        var local_path = ``
        var video_url = '' ;
        
       ffmpeg().addInput(bad_url)
       .addInput(audio)
       .on('error', async function(err){
        
        if(err.message.includes('343616999')){ //NOTE THAT .contains() should work when searching for properties in objects while .includes() is for strings
        console.log("No corresponding Audio for this video, returning no sound video")
        await downloadFile(bad_url,outputPath);
        local_path = `/videos/${title}_merged.mp4`
         video_url = 'https://socialmediamanager-production.up.railway.app' + local_path;
        return{video_url: video_url, local_path:outputPath}
            
    }
        else{console.log("Non-missing audio error ine Merge with Message: "+ err.message + "\n Skipping this post")}

       }).on('end',function(){
        console.log('Merging finished')
        local_path = `/videos/${title}_merged.mp4`
        video_url = 'https://socialmediamanager-production.up.railway.app' + local_path;
       
    }).output(outputPath)
       .run()

      return{video_url: video_url, local_path:outputPath}
     

    }catch(err){
        console.error('Error with ffmpeg fixing reddit_url: ' + err)
  
}
}

const fixRedditVideoUrl = async(bad_url,title) =>{
   
    return new Promise((resolve,reject) =>{
        try{
        var audio = bad_url.replace(/DASH_\d+/,'DASH_AUDIO_128')
        var outputPath = `./public/videos/${title}_merged.mp4`;
        ffmpeg().addInput(bad_url)
        .addInput(audio)
        .on('error',async function(err){
            if(err.message.includes('343616999')){
                await downloadFile(bad_url,outputPath)
                console.log("fixRedditUrl: no corresponding Audio for this video")
                var local_path = `/videos/${title}_merged.mp4`
                var video_url = 'https://socialmediamanager-production.up.railway.app' + local_path;
                resolve({video_url: video_url, local_path: outputPath})
            }else{
                reject("Error in fixRedditVideoUrl ffmpeg error callback: "+ err)
            }
        })
        .on('end', function(){
            console.log("Merge success");
            var local_path = `/videos/${title}_merged.mp4`
            var video_url = 'https://socialmediamanager-production.up.railway.app' + local_path;
            resolve({video_url: video_url, local_path: outputPath})

        }).output(outputPath).run()
        }catch(err){
            console.log("Somethings wrong i can feel it")
            reject("Error in fixRedditVideoUrl: "+ err)
        }



    })
   



}

const fixUrlHelper = async (bad_url,title) =>{
    return await fixRedditVideoUrl(bad_url_title)
}



module.exports = {fixRedditVideoUrl, deleteFile,fixRedditVideoUrlBad,fixRedditVideoUrll,downloadFile ,fixUrlHelper};