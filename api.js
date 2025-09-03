const express=require('express')
const app=express();
const mongoose=require('mongoose')
const cors=require('cors')
app.use(express.json())
app.use(cors());
mongoose.connect("mongodb+srv://rith172203k_db_user:MUjhE4jHoNoEtu8N@cluster0.1uuz8c5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(()=>console.log("connected to db"))
.catch(err=>console.log("not connected to db",err))


const userschema= new mongoose.Schema({
    username:{type:String,require:true},
    password:{type:String,require:true}
})
const user=mongoose.model("user",userschema)

const expenseschema= new mongoose.Schema({
    user:{type:String,require:true},
   title:{type:String,require:true},
    amount:{type:Number,require:true}
})

const expense=mongoose.model("expenses",expenseschema);

//to post the data in //
app.post('/insertdatauser',insertdatauser)
async function insertdatauser(req,res){
    try{
        const {username,password}=req.body;
        const get= await user.find({username:username})
        console.log(get);
        if(get.password===password){
        console.log("data is there")
    }
        else{
            console.log("no data")
        }

    }
    catch(err){
        res.status(500).json({error:err.message})
    }
} 


//To post the data
app.post('/insertdata',insertdata)

async function insertdata(req,res){
    const {user,title,amount}=req.body;
    console.log(req.body)
    console.log(user,title,amount);
    
    const newexpense= new expense({user,title,amount})

    try{
        await newexpense.save();
        res.status(200).send("expenses inserted")
    }
    catch(err){
        console.log(err)
    res.status(400).send("error in data insert")
    }
}

//To get the data//
app.get('/fetchalldata',fetchalldata)

async function fetchalldata(req,res){
    try{
    const fetch=await expense.find()
   res.status(200).json(fetch)
}
   catch(err){
    res.status(500).json({error:err.message})
   }
}
app.post('/fetchdatabyusername',fetchdatabyusername)

async function fetchdatabyusername(req,res){
    try{
        const{user}=req.body
        const get= await expense.find({user:user})
        console.log(get)
        res.status(200).json(get)
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}
//TO DELETE DATA//
app.delete('/deletedata',deletedata)

async function deletedata(req,res){
    try{
        const {id}=req.body
        await expense.findByIdAndDelete(id)
        res.status(200).send("DATA DELETED")
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}

//TO EDIT THE DATA//

app.put('/editdata',editdata)

async function editdata(req,res){
    try{
        const{id,title,amount}=req.body
        await expense.findByIdAndUpdate(id,{title,amount},{new:true})
        res.status(200).send("DATA UPDATED")
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}


app.listen(3000);
