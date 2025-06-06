const {Router}=require("express");
const User=require("../models/user");
const router=Router();
router.get("/signin",(req,res)=>{
    return res.render("signin");
});
router.post("/signin",async(req,res)=>{
   const {email,password}=req.body;
try{
    const token=await User.matchPasswordAndGenerateToken(email,password);
    return res.cookie("token",token).redirect("/");
}catch(err){
    return res.render("signin",{
        error:"Incorrect Email or Password",
    });
}
});
router.get("/logout",(req,res)=>{
    console.log("Logout route called");
    return res.clearCookie("token").redirect("/");
})
router.get("/signup",(req,res)=>{
    return res.render("signup");
});
router.post("/signup",async (req,res)=>{
    const {fullName,email,password}=req.body;
    await User.create({
        fullName,
        email,
        password,
    });
    return res.redirect("/");
});
module.exports=router;