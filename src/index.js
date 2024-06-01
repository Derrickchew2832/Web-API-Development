
const mongoose = require('./mongodb');
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const app = express()

const templatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

//"/login" can be personally renamed
app.get("/login", (req, res) => {
  res.render("login");
});

//"/login" derives from login.hbs's action attribute
app.post("/login", async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  };

  try {
    const check = await mongoose.findOne({ email: data.email });

    if (!check) {
      return res.render("login", { error: "User not found" });
    }

    if (check.password === data.password) {
      res.render("home");
    } else {
      res.render("login", { error: "Incorrect password" });
    }
  } catch (error) {
    res.render("login", { error: "An error occurred during login" });
  }
});


app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    email:req.body.email,
    password: req.body.password
  };

  try {
    const check = await mongoose.findOne({ email: data.email});

    if (check.email === data.email) {
      return res.render("signup", { error: "User already exists" });
    } else {
      await mongoose.insertMany([data]);
      res.render("home");
    
    }
  } catch (error) {
    res.render("signup", { error: "An error occurred during signup" });
  }
});






app.listen(3000, () => {
  console.log('Server is running on port 3000');
});