import express from 'express'
import { petModel } from '../models/Pets.js'
import { UserModel } from '../models/Users.js'
const router = express.Router()

router.get('/', async(req,res) => {
    try {
        const pets = await petModel.find({}).populate({
            path: 'Seller',
            select: 'username'
        })
        if(pets.length === 0){
            return res.json({error: 'There are no pets at the moment'})
        }

       return res.json(pets)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})


router.get("/favs/:id", async(req,res) => {
    const {id} = req.params
    try {
        const user = await UserModel.findById(id).populate({
            path: 'favourites',
            select: 'name age price imageUrl type breed weight height personality',
            populate: {
                path: 'Seller',
                select: 'name'
            }
        })

        if(!user){
            return res.json({error: "User not found. "})
        }

        const favPets = user.favourites
        res.json(favPets)
    } catch (error) {
        console.log(error)
    }
})

router.post("/favs/:id/:petId", async(req,res) => {
    const {id, petId} = req.params
    try {
        let user = await UserModel.findById(id)
        if(!user){
           return res.json({error: 'There is no user with that Id'})
        }

        user = await UserModel.findByIdAndUpdate(id, {
            $push : {favourites: petId}
        })

        res.json(user)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

router.delete('/favs/:id/:petId', async(req,res) => {
    const {id, petId} = req.params
    console.log(req.params)
    try {
        let user = await UserModel.findById(id)
        if(!user){
           return res.json({error: 'There is no user with that Id'})
        }

        user = await UserModel.findByIdAndUpdate(id, {$pull : {favourites: petId}})
        res.json(user)
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

router.get('/find', async(req,res) => {
    const {type} = req.query
    try {
         if(!type){
            return res.json({error: 'Search term required'})
         }

        const find = await petModel.find({type})
        if(find.length === 0){
            return res.json({error: 'No Pets found'})
        }

        return res.json(find)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

router.get('/filters', async(req,res) => {
    const { type, age, breed, Indian } = req.query;

try {
  const filter = {};

  if (type) {
    filter.type = type;
  }

  // Check if both ageMin and ageMax are provided
  if (age.min && age.max) {
    // Convert ageMin and ageMax to strings
    filter.age = { $gte: age.min, $lte: age.max };
  } else if (age.min) {
    // Only minimum age provided
    filter.age = { $gte: age.min };
  } else if (age.max) {
    // Only maximum age provided
    filter.age = { $lte: age.max };
  }

  if (breed) {
    filter.breed = breed;
  }

  if (Indian) {
    filter.Indian = Indian;
  }

  const pets = await petModel.find(filter);

  if (pets.length === 0) {
    return res.json({ error: 'No Pets Found' });
  }

  res.json(pets);
    } catch (error) {
        console.log(error)
    }
})
router.get('/:id', async(req,res) => {
    const {id} = req.params
    try {
        const pet = await petModel.findById(id).populate({
            path: 'Seller',
            select: 'name'
        })
        if(!pet){
            return res.json({error: 'There is no pet with that id'})
        }

        return res.json(pet)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

router.post('/', async(req,res) => {
    const {name,age, price, type, breed, weight, height, personality,Indian,imageUrl, Seller} = req.body
    try {
        const newPet = new petModel({
            name: name,
            age: age,
            price: price,
            type: type,
            breed: breed,
            weight: weight,
            height: height,
            personality: personality,
            Indian: Indian,
            imageUrl: imageUrl,
            Seller: Seller
        })

        await newPet.save()
         
        return res.json({message: 'Pet added'})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

router.delete('/:id', async(req,res) => {
    const {id} = req.params
    try {
          let deletePet = await petModel.findById(id)

          if(!deletePet){
            return res.json({error: 'Sorry there is no Pet '})
          }
         
          deletePet = await petModel.findByIdAndDelete(id)
        
         return res.json({message: 'Pet Deleted'})
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, price, type, breed, weight, height, personality, Indian, imageUrl } = req.body;
  
    try {
      let updatePet = await petModel.findById(id);
  
      if (!updatePet) {
        return res.json({ error: 'There is no pet with that id' });
      }
  
      // Create an object with only the fields that are present and not empty in the request body
      const updateFields = {};
  
      // Define a helper function to check if a value is undefined or an empty string
      const isNullOrEmpty = (value) => value !== undefined && value !== "";
  
      if (isNullOrEmpty(name)) updateFields.name = name;
      if (isNullOrEmpty(age)) updateFields.age = age;
      if (isNullOrEmpty(price)) updateFields.price = price;
      if (isNullOrEmpty(type)) updateFields.type = type;
      if (isNullOrEmpty(breed)) updateFields.breed = breed;
      if (isNullOrEmpty(weight)) updateFields.weight = weight;
      if (isNullOrEmpty(height)) updateFields.height = height;
      if (isNullOrEmpty(personality)) updateFields.personality = personality;
      if (isNullOrEmpty(Indian)) updateFields.Indian = Indian;
      if (isNullOrEmpty(imageUrl)) updateFields.imageUrl = imageUrl;
  
      // Update only the specified fields
      updatePet = await petModel.findByIdAndUpdate(id, updateFields, { new: true });
  
      return res.json({ message: 'Pet info updated successfully', updatedPet: updatePet });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  });
  
  
  



export {router as PetRouter}