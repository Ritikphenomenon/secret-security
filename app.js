const express=require('express');
const bodyparser=require('body-parser');
const ejs=require('ejs');
const encrypt=require('mongoose-encryption');

var app=express();


app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/secrets");
const trySchema= new mongoose.Schema({
    email:String,
    password:String
});

const secret="thisislittlesecret.";

trySchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const item=mongoose.model("second",trySchema);

app.get("/",function(req,res){
    res.render("home");
});

app.post("/register",function(req,res){
    const newuser= new item({
         email:req.body.username,
         password:req.body.password
    });
    newuser.save().then((results) => {
        res.render("secrets");
      }).catch((error) => {
        console.log(error);
      });
});

app.post("/login",function(req,res){
     const username=req.body.username;
     const password=req.body.password;
     item.findOne({email:username}).then((results) => {
        if(results){
            if(results.password==password)
            res.render("secrets");
        }
      }).catch((error) => {
        console.log(error);
      });
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
})

app.listen(5000,function(){
    console.log("server started");
});