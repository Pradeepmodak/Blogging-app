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
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    await User.create({ fullName, email, password });
    return res.redirect("/");
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.render("signup", {
        error: "Email is already registered.",
        oldInput: { fullName, email },
      });
    }

    return res.status(500).render("signup", {
      error: "Something went wrong. Please try again.",
      oldInput: { fullName, email },
    });
  }
});

module.exports=router;