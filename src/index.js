// require('dotenv').config({path:'./env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
// src/index.js
import app from "./app.js";  // or wherever your Express app is defined

dotenv.config({
    path:'./.env'
})

connectDB()

.then(()=>{
     // Correctly listen on the port provided by Render, with a fallback
    const host = "0.0.0.0";// Listen on all network interfaces

    app.on("error",(error)=>{
         console.log("ERR:",error);
        throw error
    })

    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is runnning at port : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed",err);
    
})

/*const app = express();
import express from "express";
(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERR:",error);
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
       })
    } catch (error) {
        console.error("ERROR:",error);
        throw error;
    }
})()
function connectDB(){}

connectDB()*/