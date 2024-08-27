const express=require('express')
const router=express.Router()
const authmiddleware=require("../middleware/midldleware")
const {fun,fun2,fun3,fun4,fun5,forgetPassword,resetPassword}=require('../controller/use_api_functn')
router.post('/signup',fun)
router.post('/signin',fun2)
router.delete('/delet/:id',fun3)
router.put('/upd/:id',fun5)
router.post('/forgetPassword',forgetPassword)
router.post('/resetPwd',resetPassword)

router.get('/alluser',authmiddleware,fun4)


module.exports=router;