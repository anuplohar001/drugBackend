import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import { configDotenv } from 'dotenv';
import User from './models/user.js';

configDotenv();
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://drug-recommendation.vercel.app"],
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD"
}))

app.post('/createuser', async (req, res) => {
    const { userType, username, email, password } = req.body
    console.log(req.body)
    try {
        const users = await User.create({ userType, username, email, password });
        await users.save()
        return res.status(200).send({ message: "User Created" })
    } catch (error) {
        return res.status(500).send({ message: "Something went wrong" })
    }
})

app.post('/loginuser', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });        
        if(user){
            if(user.password === password){
                return res.status(200).send({ message: "User Created" })
            } else {
                return res.status(400).send({ message: "Password Incorrect" })
            }
        } else {
            return res.status(400).send({ message: "User Not found" })
        }

    } catch (error) {
        return res.status(500).send({ message: "Something went wrong" })
    }
})

app.get('/', (req, res) => {
    res.send("Welcome to server ")
})

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Successfully connected")
});

app.listen(process.env.PORT, () => {
    console.log("Server is Listening on PORT : ", process.env.PORT)
})