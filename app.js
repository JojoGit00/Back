const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
require('dotenv').config()


const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express();

app.use(helmet());

mongoose
  .connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));


// CORS

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  }); 


app.use(express.json());


//dossier image  pour les requêtes POST
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);







module.exports = app;
