const {Router}=require("express");
const multer=require("multer");
const path = require("path");
const Blog=require("../models/blog");
const router=Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("./public/upload"));
    },
    filename:function (req, file, cb) {
      const fileName=`${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  })
  const upload = multer({ storage: storage })
router.get("/add-new",(req,res)=>{
    console.log("Add new blog route called",res.user);
    return res.render("addblog",{
        user:req.user,
    });
});
router.get("/:id",async (req,res)=>{
  const blog=await Blog.findById(req.params.id);
  console.log(blog);
  return res.render("blog",{
    user:req.user,
    blog,
  })
})
router.post("/",upload.single("coverImage"),async(req,res)=>{
const {title,body}=req.body;
const blog=await Blog.create({
    body,
    title,
    createdby: req.user._id,
    coverImageUrl:`/upload/${req.file.filename}`,
});
// console.log(blog.coverImageUrl);
return res.redirect(`/blog/${blog._id}`);
});
module.exports=router;