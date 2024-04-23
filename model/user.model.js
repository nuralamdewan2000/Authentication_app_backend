const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  profilePicture :{
        type:String,
        default:"https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    },
  name: {
    type: String,
   
  },
  bio:{
    type:String 
  },
  phone:{
   type:String
  },
  email: {
    type: String,
    required: true,
    unique: true
  }, 
  password: {
    type: String,
    required: true
  }
},{
    versionKey:false
});

const UserModel =mongoose.model('User', userSchema);
module.exports = {
    UserModel
}
