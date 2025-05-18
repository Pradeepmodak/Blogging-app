const {Schema , model}=require("mongoose");
const { createHmac, randomBytes} = require('crypto');
const { type } = require("os");
const {createTokenForUser}=require("../services/authentication");
const userSchema=new Schema({ 
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },  
    salt:{
       type:String,
    },  
    password:{
        type:String,
        required:true
    },
    profileImageUrl:{
        type:String,
        default:"/images/default.png"
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
},{timestamps:true});
    
// save krne se pehle password ko hash krdo
userSchema.pre("save",function(next){
    const user=this;
    // isModified is a mongoose function to check if password is modified or not 
    if(!user.isModified("password")) return;
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac("sha256",salt)
    .update(user.password)
    .digest("hex");
    user.salt=salt;
    user.password=hashedPassword;
    next();
})

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error("User not found!");
    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256",salt)
    .update(password)
    .digest("hex");

    if(hashedPassword!==userProvidedHash) throw new Error("Incorrect password!");

    const token=createTokenForUser(user);
    return token;
})
const User=model("User",userSchema);
module.exports=User;