const mongoose= require("mongoose");
const schema=mongoose.Schema;
const objectId= mongoose.ObjectId;

const user= new schema({
    email: {type: String, unique: true},
    password: String,
    name: String
})

const todo= new schema({
    title: String,
    done: Boolean,
    userId: objectId
})

const usermodel= mongoose.model('users',user);
const todomodel= mongoose.model('todos', todo);

module.exports={
    usermodel: usermodel,
    todomodel: todomodel
}