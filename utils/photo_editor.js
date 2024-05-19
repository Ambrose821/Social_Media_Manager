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
module.exports =  {createInstagramImage, edit_image};