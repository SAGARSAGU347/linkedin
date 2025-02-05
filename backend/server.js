import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/posts.routes.js';



dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.static("uploads"))



//routes
app.use(postRoutes);
app.use(userRoutes);


const start= async()=>{
    const connectDB=await mongoose.connect("mongodb+srv://sagarsagu347:sagarkishore52253@linkedinclone.uhdck.mongodb.net/")
}


app.listen(9080,()=>{
    console.log("server is running on port 9090")
})

start();