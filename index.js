const express =require('express');
const {connection} =require('./config/db');
const {userRouter} =require('./routes/user.routes')



const app = express();
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