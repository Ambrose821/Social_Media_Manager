const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'dniqtkfhi', 
  api_key: '945359745133628', 
  api_secret: 'MaExnL6XBOOa7WyXnK9kaL8jtQI' 
});




//GPT Suggestion: 
async function createInstagramImage(imageUrl) {
    // Upload image from URL and resize for Instagram
    const uploadedImage = await cloudinary.uploader.upload(imageUrl, {
        folder: 'your-folder',
        transformation: [
            { width: 1080, height: 1080, crop: "fill" }
        ]
    });

    const publicId = uploadedImage.public_id;

    // Generate transformation with text and logo
    const transformedUrl = cloudinary.url(publicId, {
        transformation: [
            { width: 1080, height: 1080, crop: "fill" },
            {
                overlay: {
                    font_family: "Arial",
                    font_size: 40,
                    font_weight: "bold",
                    text: "YOUR TEXT HERE"
                },
                color: "#FFFFFF",
                background: "linear-gradient(to bottom, transparent, black)",
                gravity: "south",
                y: 20,
                width: 1080,
                crop: "fit"
            },
            {
                overlay: {
                    public_id: "olympic_flag",
                },
                width: 100,
                gravity: "south",
                y: 80
            }
        ]
    });

    console.log(transformedUrl);
}







const edit_image = async (img_url, img_text) =>{
try{
const image = await cloudinary.uploader.upload(img_url,
  { public_id: img_text} );

  const publicId = image.public_id;
  const text = img_text
  const encodedText = encodeURIComponent(text);
  let imageUrl = cloudinary.url(publicId, {
    transformation: [
        {width:1080, height:1080, crop: 'fill'},
      {
        effect: "gradient_fade,y_-0.5,b_black",
       
      },
      {
        overlay: `text:Impact_60:${encodedText}`, // black shadow as text overlay
        gravity: "south",
        y: 120, // Slightly offset for shadow effect
        color: "black", // Red color for the shadow
        width: 1000,
        crop: "fit"
      },
      {
        overlay: `text:Impact_60:${encodedText}`, // Text overlay
        gravity: "south",
        y: 125,
        color: "white",
        width: 1000, // Ensuring the text fits within the image width
        crop: "fit", // Fit the text within the specified width   
         
    }
    ]
  });
  
  console.log(imageUrl);
  return imageUrl;
  }catch(err){
    console.error("Error Editin Photo: "+err )
  }
  




}

const fix_reddit_photo_url = async(bad_url, title) =>{
  try{
    const upload_image = await cloudinary.uploader.upload(bad_url,{public_id: title, transformation: [
      { width: 1080, height: 1080, crop: "fill" }
  ]})
    console.log("Fixed Reddit Photo:  " + upload_image.url)
    return upload_image.url;

  }catch(err){
    console.error("Error in fix_reddit_photo_url(): " +err);
    return null;

  }

}

const fix_reddit_video_url = async(bad_url,title) =>{

  try{
   //get the audio for the video
   const audio = bad_url.replace(/DASH_\d+/, 'DASH_AUDIO_128')
   const audio_id = `${title}_audio`

 

    const video_upload = await cloudinary.uploader.upload(bad_url,
      { resource_type: 'video',
        public_id: title})

    const new_url = cloudinary.url(video_upload.public_id,{
      resource_type: 'video',
      transformation :[{ width:1080, height:1080, crop: 'fill' }]
    })
    
    const audio_upload = await cloudinary.uploader.upload(audio,{
      resource_type:'video',
      public_id : audio_id
    })

    const audio_url = cloudinary.url(audio_id,{resource_type: 'video'})
    console.log("Audio " + audio_url)

    const mergedVideoUrl = cloudinary.url(video_upload.public_id, {

      resource_type: 'video',
      
      transformation: [
      
      { overlay: `audio:${audio_id}` },
      
      { flags: "layer_apply" }
      
      ]
      
      });
      
      
   

    // const mergedVideoUrl = cloudinary.url(video_upload.public_id, {
    //   resource_type: 'video',
    //   transformation: [
    //     { overlay: audio_id, resource_type: 'video', flags: "splice" }
    //   ]
    // });


      console.log('merged: '+ mergedVideoUrl)

      return mergedVideoUrl;
    

  }catch(err){
    console.error("Error in fix_reddit_video_url(): " + JSON.stringify(err)+ "\nRegular error: " + err)
  }

}
module.exports =  {createInstagramImage, edit_image, fix_reddit_video_url,fix_reddit_photo_url};