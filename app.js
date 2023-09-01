import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";

const app = express()
const port = 3000;


app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email: {
        type: "String",
        Required: [true, "Must enter email"]
    },
    password: {
        type: "String",
        Required: [true, "Must enter password"]
    }
})

const secret = process.env.SECRET


userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]}) 

const User = new mongoose.model("User", userSchema)


app.get('/', (req, res) => {
    res.render("home.ejs");
})

app.get('/login', (req, res) => {
    res.render("login.ejs");
})

app.post('/login', async (req, res) => {

   let userEmail = req.body.username;
   let userPassword = req.body.password;

    let user = await User.find({email: userEmail})
    console.log(user)

if (user && user.length > 0) {
    if (user[0].password !== undefined && user[0].email !== undefined) {
    if (user[0].password === userPassword) {
        res.render("secrets.ejs")
    } else {
    res.redirect("/login");
    }
}};
})

app.get('/register', (req, res) => {
    res.render("register.ejs");
})

app.post('/register', async (req, res) => {
    await User.create({email: req.body.username, 
        password: req.body.password
    })
    res.render("secrets.ejs");
})


app.listen(port, () => {
console.log(`Server is on and running on port ${port}`)
});