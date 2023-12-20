import dotenv from 'dotenv';
dotenv.config();

import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/Users.js';
const router = express.Router()

const {SECRET_KEY} = process.env

router.get("/", async(req,res) => {
    try {
        const response = await UserModel.find({})
        res.json(response)
    } catch (error) {
        res.json(error)
    }
})

router.post("/register", async(req,res) => {
    const {username, password, type} = req.body
    const user = await UserModel.findOne({username})
    if(user){
        return res.json({message: "user already exists!"});
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
        const newUser = new UserModel({username, password:hashedPassword, type})
        const response = newUser.save()
        res.json(response)
    } catch (error) {
        console.log(error)
        
    }
})

router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });
  
      if (!user) {
        return res.json({
          error: 'No User found'
        });
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (match) {
        const token = jwt.sign({ id: user._id, username: username, type: user.type }, SECRET_KEY);
  
        console.log(token);
        res.json({ token});
      } else {
        // Passwords don't match, don't generate a token
        res.json({
          error: "Passwords don't match"
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
  
//Seller Routes

router.get('/sellers', async(req,res) => {
  try {
      const sellers = await UserModel.find({type: 'Seller'}).populate({
          path: 'pets',
          select: 'name type'
      })
      if(sellers.length === 0){
          return res.json({message: 'No sellers'})
      }

      return res.json(sellers)
  } catch (error) {
      console.log(error)
      res.json(error)
  }
})

router.get('/buyers', async(req,res) => {
  try {
      const buyers = await UserModel.find({type: 'Buyer'})
      if(buyers.length === 0){
          return res.json({message: 'No Buyers'})
      }

      return res.json(buyers)
  } catch (error) {
      console.log(error)
      res.json(error)
  }
})

router.put("/sellers/:id", async(req,res) => {
  const {id} = req.params
  const {pets} = req.body
  try {
      const seller = await UserModel.findByIdAndUpdate(id, {
         $push: {pets}
      })

      res.json(seller)
  } catch (error) {
      console.log(error)
      res.json(error)
  }
})

router.delete("/sellers/:id/:petId", async(req, res) => {
  const {id, petId} = req.params

  try {
      const deletePet = await UserModel.findByIdAndUpdate(id, {$pull : {pets: petId}})
      res.json({message: 'Pet removed successfully'})
  } catch (error) {
      res.status(500).json({ error: "Error in deleting pet" });
  }
})

export {router as UserRouter}

//VerifyToken

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    console.log(token)
    if (token) {
        const tokenParts = token.split(' ');
        if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
          const tokenString = tokenParts[1];
          // Verify the token here
          jwt.verify(tokenString, SECRET_KEY, (err) => {
            if (err) {
              return res.sendStatus(403);
            } else {
              // Attach the decoded payload to the request object
              req.decoded = decoded;
              next();
            }
          });
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(401);
      }
}