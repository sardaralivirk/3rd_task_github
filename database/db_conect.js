//const express=require('express')
const mongoose=require('mongoose')

const db=mongoose.connect('mongodb://localhost:27017/3rd_task').then(()=>{
    console.log("Connect");
    
})

    module.exports=db;