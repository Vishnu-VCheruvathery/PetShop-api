import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
const app = express()

import cors from 'cors'
import mongoose from 'mongoose';
import { UserRouter } from './routes/userRoutes.js';
import { PetRouter } from './routes/petRoutes.js'

const corsOptions = {
    origin: ['http://localhost:5173', 'https://celadon-manatee-ed5195.netlify.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

const {MONGO_URL} = process.env

app.use(express.json())
app.use(cors(corsOptions))
app.use('/users', UserRouter)
app.use('/pets', PetRouter)


mongoose.connect(MONGO_URL)




app.listen(3000, () => {
    console.log("Server started on port 3000")
})
