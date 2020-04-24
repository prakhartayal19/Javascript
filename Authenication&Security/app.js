//jshint esversion:6
const express=require("express");             // Import express module and others
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();                                   // Make an object of express
app.set("view engine","ejs")                          // set view engine as ejs
app.use(bodyParser.urlencoded({extended:true}));     // use of bodyparser
app.use(express.static("public"));                  // To use public css or other files

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology: true})

const userSchema={                                          //Creating user scheme with email and password
    email:String,
    password:String
};

const User=new mongoose.model("user",userSchema);           // Creating database model


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});



app.get("/submit",function(req,res){
    res.render("submit");
});

app.get("/logout",(req,res)=>{
    res.render("home");
});
app.post("/register",function(req,res){
    const user=new User({
        email:req.body.username,
        password:req.body.password
    })
    user.save();                                                      //Save user data in database
    res.render("secrets")                                             //After register it renders secretrs page
});

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;

    User.findOne({email:username},function(err,foundUser){          //Finds whether an email exists in database or not
        if(err){
            console.log("Error occured!!!");
            
        }
        else{
            if(foundUser){
                console.log(foundUser)
                if(foundUser.password===password){                  //To check whether password is correct or not
                    res.render("secrets")
                }
                else{
                    res.send('<b>Invalid password !!!</b>')         // if passsword is wrong it dislays a message
                }
            }
            else{
                res.send("<h2>Invalid email Id !!</h2>")            //If email id is not registered it display a messgae
            }
        }
    })
})


app.listen(3000,function(){
    console.log("App is listening on port: 3000");
    
})