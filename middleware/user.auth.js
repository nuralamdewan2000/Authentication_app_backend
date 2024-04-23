const jwt =require('jsonwebtoken')
const {UserModel} =require('../model/user.model')
require('dotenv').config();


const auth =async(req,res,next) =>{
    const token =req.headers.authorization?.split(" ")[1]
    if(token){
        jwt.verify(token,process.env.SecretKey,async(err,decoded) =>{
            if(decoded){
                const {userId} =decoded;
                const user =await UserModel.findOne({_id:userId})
                req.user = user;
                next()
            }else{
                res.send({msg:"not authorized","error":err})
            }
        })
    }else{
        res.send({msg:"please login"})
    }
}

module.exports ={
    auth
}
