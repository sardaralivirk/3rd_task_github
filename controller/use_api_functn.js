
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
//const findotp=require('./otpmatch')
//const otpGenerator = require('otp-generator')
const genrateOtp=require('../otpfolder/otp')
const nodemailer=require('nodemailer')
//const authmiddleware=require('../middleware/midldleware')
const Shme=require('../schema/creatShema')
const SecretKey="14254"


const  fun=async (req,res)=>{
    console.log("entered")
   const { name, possward,email } = req.body;
   const existingUser = await Shme.findOne({ email });
   console.log("kli")
   if(!existingUser){

    
    console.log(possward);
    const data={
        "name":"rrrrr", 
  "email": "kjk@gmail"
    }
   
    const token = jwt.sign(data,SecretKey);
    console.log("11")
    
        const hash = await bcrypt.hash(possward, saltRounds);
        console.log("check")
        const oldUser = await Shme.create({
             name, 
             possward:hash,
             email });

    res.json({oldUser,token})
    console.log("li")
    }
       
                                                                             // 1st check if user not exciste then create otherwise show msg you have a alread account 
    else {
    return res.status(400).json({ message: 'User already exists' });
    
    }
}


const  fun2=async (req,res)=>{
    console.log("entered")
   const {  possward,email } = req.body;
   
   const oldUser = await Shme.findOne({ email });
   const data={
    "name":"rrrrr", 
"email": "kjk@gmail"
}

const token = jwt.sign(data,SecretKey);
   if(!oldUser){
    return res.status(400).json({message:"your email is not valid"})
    }
 const match=await bcrypt.compare(possward,oldUser.possward)
    console.log(match)
    if(!match){
        console.log("okay")
         return res.status(400).json({ message: "Invalid credentials" });
    }
    else{
        console.log("okay2")
       return res.json({message:"your memory is very good ",token})
    }

}
const fun3=async(req,res)=>{
    console.log(req.params.id)  //for  delete
    const dlt= await Shme.deleteOne({ _id: req.params.id });
         res.json(dlt)
}
const fun4=async (req,res) => {
    const shm=await Shme.find({},'name email') // for find all data without password
    res.status(200).json({shm})
    
}
const fun5=async(req,res)=>{
    console.log(req.params.id)  //for  delete
    const UpDate= await Shme.findOneAndUpdate({ _id: req.params.id });
    
    { 
        _id: req.params.id
    }
    {
        mobile:"abc"     
    }

res.json(UpDate)
}

const  forgetPassword=async(req,res)=>{
    
    try {
        const {email}=req.body;
       
        if(email){
            const checkUser=await Shme.findOne({email})
            console.log(checkUser)
            if(checkUser){
                const token=jwt.sign({email},SecretKey)
                const link=`localhost:3000/forgetPassword/${email}/${token}`
                // return res.json({message:"check your email and re set password"})
                console.log(token)
            }
            else{
                return res.status(400).json({message:'user not found'})
            }
        }
        else{
            return res.status(400).json({message:'pleas give email'})
        }
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Use the correct SMTP server address
            port: 587, // Use port 587 for TLS
            secure: false, // Use false for TLS (true for SSL)
            auth: {
                user: 'sardaralivirk@gmail.com', // Your email address
                pass: 'qbxoioonrudfwvjj' // Your application-specific password
            }
        });
        const OTP=genrateOtp();
        const saveOtp = new Shme({
            email:'b-23313@student.usa.edu.pk',
            possward:"assasasasasas",
            otp:OTP
        })
        await saveOtp.save()
        
        const info = await transporter.sendMail({
            from: 'String@gmail.com', // Your sender email
            to: 'b-23313@student.usa.edu.pk', // Recipient email
            subject: 'Reset Password', // Email subject
            text: `Click on this link to generate your pass`, // Plain text content
            html: `<h1>Hello ${OTP}</h1>` // HTML content
        });

        console.log("Email sent successfully!");
        console.log(info);

        // Respond to the client
        return res.status(200).json({ message: 'Password reset link successfully sent to your Gmail account' });
   
    //await transporter.sendMail(receiver);
    
}
catch (error) {
    console.log(error)
    return res .status(400).json({meassage:"not send link to mail "})
}
}


const resetPassword = async (req, res) => {
    try {
        const { password, confirm_password,  _id, email, otp } = req.body;

        // Validate the input
        if (!password || !confirm_password || !_id) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords must match' });
        }

        // Hash the new password
        const salt = 10;
        const newHashPassword = await bcrypt.hash(password, salt);
        console.log('New hashed password:', newHashPassword);

        // Find and update the user password
        const updatedUser = await Shme.findOneAndUpdate(
            { _id: _id ,
                otp:otp
            }, 
            { possward: newHashPassword,
                otp:""
             },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Otp related to this user is incorrect' });
        }

        // Optionally delete the OTP if needed
        // await Shme.deleteOne({ email, otp });

        console.log('Updated user:', updatedUser);
        return res.json({ message: 'Password successfully updated' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 'failed', message: 'Internal server error', error: error.message });
    }
}


// const resetPassword=async (req,res) => {
//     //const {password,confirm_password,id,email,otp}=req.body;
//     //const {email,otp}=req.body;
// //const findotp=await Shme.findOne({email,otp})
// //if(findotp){
//     //const {password,confirm_password,id,email,otp}=req.body;
//     //const{token}=req.headers;
//     //const id=req.body;
//     //const user=await Shme.findOne({id});
    
// //  const new_token=await jwt.sign({id},SecretKey)
//  //   console.log("lklk")
//           try {
//             //  console.log("lkl2222k")
// //  const vrfy=await jwt.verify(new_token,SecretKey)
//  //        console.log(vrfy)
//  const {password,confirm_password,id,email,otp}=req.body;
 
//         if(password&&confirm_password){
          
//          if(password!==confirm_password){
//              return res.status(400).json({message:"muste be entered a same password"})
//           }
 
//           else{
 
//              const salt=10;
//              const newhashpassword=await bcrypt.hash(password,salt);
//             //  console.log(newhashpassword)
//              console.log(newhashpassword)
//              const newpwd=await Shme.findOneAndUpdate({_id:id},{possward:newhashpassword},{new:false})
//             console.log("ali")
//              console.log(newpwd)
//              //const updtaeotp=await Shme.findOneAndUpdate({_id:id},{$set:{otp:""}});
//              //console.log(updtaeotp)
//             //  await updtaeotp.save()
//              return res.json({message:"password successfully "})
             
//           }}
//      else{
//          return res.status(400).json({meassage:'all filed are require '})
//      }
     
//     } 
    
//     catch (error) {
//      console.log(error)
//      res.json({"status":"failed","meassage":"invalid token",message:"please send a valid email or otp"})
//     }
 
 
 
// }

// else{
//     return res.status(400).json({message:"your email and otp not find"})
// }
// //    const {password,confirm_password}=req.body;
// //    const{token}=req.headers;
// //    const id={
// //     id:"66b467457d848f216d8b0edd"
// //    }
// //    const user=await Shme.findOne({id});
   
// // const new_token=await jwt.sign({id},SecretKey)
// //  console.log(new_token)
// // //   console.log("lklk")
// //          try {
// //             console.log("lkl2222k")
// // const vrfy=await jwt.verify(new_token,SecretKey)
// // //        console.log(vrfy)


// //        if(password&&confirm_password){
         
// //         if(password!==confirm_password){
// //             return res.status(400).json({message:"muste be entered a same password"})
// //          }

// //          else{

// //             const salt=10;
// //             const newhashpassword=await bcrypt.hash(password,salt);
// //             console.log(newhashpassword)
// //             await Shme.findOneAndUpdate(req.body._id,{$set:{password:newhashpassword}})
// //             return res.json({message:"password successfully "})
// //          }}
// //     else{
// //         return res.status(400).json({meassage:'all filed are require '})
// //     }
    
// //    } 
   
// //    catch (error) {
// //     console.log(error)
// //     res.send({"status":"failed","meassage":"invalid token"})
// //    }





// //   try {
// //         const{token}=req.headers;
// //         const{password}=req.body;
// //         if(!password){
// //             return res.status(400).json({message:"please provide password"})
// //         }
// //         const decode =jwt.verify(token,SecretKey)
// //         const user=await shm.findOne({email:decode.email})
// //         const newhashpassword= await hashPassword(password)
// //         user.password=newhashpassword;
// //         await user.save
// //         return res.status(200).json({message:"your password is reset successfully"})
// //     } catch (error) {
        
// //     }
// }




module.exports={fun,fun2,fun3,fun4,fun5,forgetPassword,resetPassword}