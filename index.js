
const bcrypt= require("bcrypt");
const express= require("express")
const {usermodel, todomodel}= require("./db");
const jwt = require("jsonwebtoken");
const mongoose= require("mongoose");
const { z } = require("zod")
const app=express()

const path = require('path');
// serve all files in ./public
app.use(express.static(path.join(__dirname, 'public')));

require("dotenv").config();          // << add this at the very top
const JWT_SECRET = process.env.JWT_SECRET;
mongoose.connect(process.env.MONGO_URI);
app.use(express.json());
app.get("/", function(req,res){
    res.sendFile(__dirname, '/public/index.html')
})
app.post("/signup", async function(req, res){
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        name:z.string().min(3).max(100),
        password: z.string().min(3).max(100)
    })
    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success){
        return res.status(403).json({
            message:"Incorrect Format",
            error: parsedData.error
        })
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try{
        const hashedPassword =await bcrypt.hash(password, 5)
        await usermodel.create({
            email,
            password:hashedPassword,
            name
        })
    }catch (e) {
        console.error("Signup error:", e);
        if (e.code === 11000) {
            console.log("Duplicate key details:", e.keyValue);
            return res.status(409).json({ msg: "User already exists", duplicate: e.keyValue });
        }
    }

    res.json({
        msg:"You are signed up"
    })
})
app.post("/signin", async function(req, res){
    const email= req.body.email;
    const password= req.body.password;

    const user= await usermodel.findOne({
        email:email
    });

    if (!user){
        res.status(403).json({
            message: "user does not exist in our database"
        })
        return
    }

    const passwordmatch= await bcrypt.compare(password, user.password);
    if (passwordmatch){
        const token=jwt.sign({
            id: user.id
        }, JWT_SECRET);
        res.json({
            token: token
        });
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})


app.post("/todo", auth, async function(req, res){
    const userId=req.userId;
    const title= req.body.title;
    const done = false
    await todomodel.create({
        title,
        userId,
        done
    })
    res.json({
        message: "todo created"
    })
});

app.get("/todos", auth, async function(req, res){
    const userId=req.userId;
    const todos = await todomodel.find({
        userId
    })
    res.json({
        todos
    })
});

function auth(req, res, next){
    try{
        const token =req.headers.token;
        const decodeddata=jwt.verify(token, JWT_SECRET);
        req.userId=decodeddata.id;
        next();
    }catch(e){
        res.status(403).json({
            message: "invalid token"
        });
    }
}

app.delete("/todo/:id", auth, async function(req, res){
    try{
        const id= req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.json({
            message: "todo deleted"
        })
    }catch(e){
        res.status(403).json({
            message: "error deleting todo"
        })
    }
})

app.listen(3000);