import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import { startSendOtpConsumer } from './consumer.js';

const app= express();

startSendOtpConsumer()

const port= process.env.PORT

app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}`);
})