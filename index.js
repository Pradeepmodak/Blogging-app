const path=require("path");
const express=require("express");
const userRoute=require("./routes/user");
const mongoose=require("mongoose");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const PORT=3000;
const cookieParser=require("cookie-parser");
const app=express();
mongoose.connect("mongodb://127.0.0.1:27017/blogify").then((e)=>{
    console.log("mongodb connected");
});
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.get("/",(req,res)=>{
    // console.log("user",req.cookies.token);
    res.render("home",{
        user:req.cookies.token,
    });
});
app.use("/user",userRoute);
app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));  
