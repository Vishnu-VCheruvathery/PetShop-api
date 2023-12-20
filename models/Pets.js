import mongoose from "mongoose"


const petSchema = mongoose.Schema({
    name: {
        type: String
    },
    age: {
        type: String
    },
    price: {
       type: Number
    },
    type: {
        type: String
    },
    breed: {
        type: String
    },
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    personality: {
        type: String
    },
    Indian:{
        type: Boolean
    },
    imageUrl:{
        type: String
    },
    Seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
})

export const petModel = mongoose.model('Pet', petSchema) 