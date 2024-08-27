const {email,otp}=req.body;
const findotp=await Shme.find({email,otp})
if(findotp){

    const {password,confirm_password}=req.body;
    const{token}=req.headers;
    const id={
     id:"66b467457d848f216d8b0edd"
    }
    const user=await Shme.findOne({id});
    
 const new_token=await jwt.sign({id},SecretKey)
  console.log(new_token)
 //   console.log("lklk")
          try {
             console.log("lkl2222k")
 const vrfy=await jwt.verify(new_token,SecretKey)
 //        console.log(vrfy)
 
 
        if(password&&confirm_password){
          
         if(password!==confirm_password){
             return res.status(400).json({message:"muste be entered a same password"})
          }
 
          else{
 
             const salt=10;
             const newhashpassword=await bcrypt.hash(password,salt);
             console.log(newhashpassword)
             await Shme.findOneAndUpdate(req.body._id,{$set:{password:newhashpassword}})
             return res.json({message:"password successfully "})
          }}
     else{
         return res.status(400).json({meassage:'all filed are require '})
     }
     
    } 
    
    catch (error) {
     console.log(error)
     res.send({"status":"failed","meassage":"invalid token"})
    }
 
 
 
}

else{
    return res.status(400).json({message:"your email and otp not find"})
}







eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJpZCI6IjY2YjQ2NzQ1N2Q4NDhmMjE2ZDhiMGVkZCJ9LCJpYXQiOjE3MjM0NDkwMTB9.tZurtgYp_fo1sTAuhFqww5FEBaIWWhUmck3IRrdXOgs