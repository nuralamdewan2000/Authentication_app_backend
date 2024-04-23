const express =require('express');
const cors =require('cors');
const {connection} =require('./config/db');
const {userRouter} =require('./routes/user.routes')
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());
app.use('/users',userRouter); 


app.get('/',(req,res) =>{
    res.status(200).send({msg:"This is the home route"});
})


app.listen(process.env.PORT, async() =>{
    try{
        console.log(`server is running on http://localhost:${process.env.PORT}`);
        await connection
        console.log('connected to the database')
    }catch(err){
        console.log(err);
    }
  })  