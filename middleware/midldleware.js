const  Jwt = require("jsonwebtoken");
const secretKey="14254"
const authmiddleware=async(req,res,next)=>{
const token=req.headers.authorization
console.log(token)
if(!token){
    return res.status(401).json({message:'your token is not accurete '})
} try {
     const decod=Jwt.verify(token,secretKey);
     res.user=decod;
     next()
} catch (error) {
    console.error();
    res.status(401).json({message:'invalied '})
}


}


//const secretKey = 'your_secret_key'; // Use a strong and secure key in production

// Function to generate a token





module.exports=authmiddleware;



