const InstaAccount = require('../models/InstaAccount');


const add_insta_account= async (instaId, account_name)=>{
    
    try{
        const account = new InstaAccount({
            account_name: account_name,
            instagram_id: instaId
        })

        await account.save();


    }catch(err){

        if(err.code === 11000){
        //res.status(501).json({message: "Account already exists", success:false})
        console.log("Account Already exists")
        }else{
           // res.status(500).json({message:`Err adding account: ${err}`, success: false})
           console.log(err)
        }
    }

}

module.exports = add_insta_account;