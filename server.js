const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//connecting server to database
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //local host
    user: "postgres", //user
    password: "789456",
    database: "facer",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

//server
const app = express();

app.use(express.json());

//corse npm
app.use(cors());

//root
app.get("/", (req, res) => {
  res.send("success");
});

//sign
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
}); //dependency injection

//register
app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

//profile
app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

//image
app.put("/image", (req, res)=>{
  image.handleImage(req, res, db);
});

//Api
app.post("/imageurl", (req, res)=>{
  image.handleApiCall(req, res);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*
/ res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user

*/