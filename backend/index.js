const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv/config');

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGODB_URL)
.then(() => {console.log('Connected to MongoDB');} )
.catch((err) => {console.log(err);} );

app.listen(PORT, () => {console.log(`server is runnig - http://localhost:${PORT}`)});