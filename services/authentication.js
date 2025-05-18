const { profile } = require("console");
const JWT=require("jsonwebtoken");
const secret="mysecretkey";

function createTokenForUser(user){
    const payload={
        _id:user._id,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role,  
    };
    const token=JWT.sign(payload,secret);
    // console.log("token in auth service",token);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    // console.log("auth payload",payload);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken
};