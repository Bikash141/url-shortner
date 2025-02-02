const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nanoid = require('nanoid').nanoid;
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());

// Connection to database
const dbUrl = process.env.DATABASE_URL;

const urlSchema = new mongoose.Schema({
    originalUrl:String,
    shortUrl:String,
    clicks:{type: Number , default: 0},
});

const Url = mongoose.model('Url' , urlSchema)

app.post('/api/short' , async (req, res) => {
    try{
        const { originalUrl } = req.body;
        const shortUrl = nanoid(8)
        const url = new Url({ originalUrl, shortUrl })

        await url.save();
        return res.status(200).json({message: "Url Generated", url: url})

    }catch (error){
        console.log(error)
        res.status(500).json({error: "Server Error"})

    }
})

app.get('/:shortUrl' , async (req, res) => {
    try{
        const { shortUrl } = req.params;
        const url = await Url.findOne({ shortUrl});
        if(url){
            url.clicks++;
            await url.save();
            return res.redirect(url.originalUrl)
        }else{
            return res.status(400).json({error: "Url Not Found"})
        }
    }catch (error) {
        console.log(error)
        res.status(500).json({error: "Server Error"})
    }
})

mongoose.set('strictQuery', true); // Suppress deprecation warnings
mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on('error', (err) => {
  console.error(err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});