import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    type:{
        type: String
    },
    favourites : [{
        type: mongoose.Types.ObjectId,
        ref: 'Pet'
    }],
    pets: [{
        type: mongoose.Types.ObjectId,
        ref: 'Pet'
    }],
     // Add messages field to store user messages
    
})

export const UserModel = mongoose.model('User', UserSchema)