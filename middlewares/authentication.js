function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
    const tokenCookieValue=req.cookies[cookieName];
    // console.log("tokenCookieValue",tokenCookieValue);      
    if(!tokenCookieValue){
   return next();
    }
    try{
        const userPayload=validateToken(tokenCookieValue);
        req.user=userPayload;
        // console.log("userPyload",userPayload);
    }
    catch(err){
        // console.log("error",err);
    }
   return next();
    };
}
module.exports={
    checkForAuthenticationCookie,
};