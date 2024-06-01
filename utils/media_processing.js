const fs = require('fs')
const axios = require('axios')
const ffmpeg = require('fluent-ffmpeg');
const configUrl = require('../config/configUrl')



const downloadFile = async (url, downloadPath) =>{
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
                resolve()
            }
        })
    })
} 



const fixRedditVideoUrl = async (bad_url,title) =>{
    try{
        
        const videoPath = `./public/videos/${title}.mp4`
        const audioPath = `./public/videos/${title}_audio.mp4`
        const outputPath = `./public/videos/${title}_merged.mp4`

        await downloadFile(bad_url,videoPath);
        const audio = bad_url.replace(/DASH_\d+/, 'DASH_AUDIO_128')
        await downloadFile(audio,audioPath)

        ffmpeg(videoPath).addInput(audioPath).outputOptions('-c:v copy').outputOptions('-c:a aac').save(outputPath).on('end', () =>{console.log("Merged video saved at " +outputPath)}).on('error',(err) =>{
            console.error('Error merging video and audio',err)
        })

        //await deleteFile(videoPath)
        // await deleteFile(audioPath)
        
        const public_ret_path =`/videos/${title}_merged.mp4`
        console.log("Video Path: "+configUrl.getBaseUrl()+public_ret_path)
        return public_ret_path

    }catch(err){
        console.error('Error with ffmpeg fixing reddit_url: ' + err)
    }
}

module.exports = {fixRedditVideoUrl, deleteFile};