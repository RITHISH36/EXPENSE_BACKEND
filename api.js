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

const expenseschema= new mongoose.Schema({
    user:{type:String,require:true},
   title:{type:String,require:true},
    amount:{type:Number,require:true}
})

const expense=mongoose.model("expenses",expenseschema);

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
app.get('/fetchdatabyusername',fetchdatabyusername)

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

app.get('/getdatabytitle',getdatabytitle)

async function getdatabytitle(req,res){
    try{
        const {title}=req.body
        const find=await expense.find({title})
        console.log(find)
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}
app.listen(3000);
