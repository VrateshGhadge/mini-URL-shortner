const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
const { nanoid } = require('nanoid');

app.use(express.json())
app.use(cors());

dotenv.config();

let urlDatabase = []

app.post('/api/shorten' , (req, res)=>{
    // extract 'originalUrl' from req.body
    const { originalUrl } = req.body;
    console.log("The user wants to shorten", originalUrl);

    if (!originalUrl){
        return res.status(400).json({
            msg: "Original URL not found"
        })
    }

    const shortCode = nanoid(6)
    console.log(shortCode)

    const newUrl = {
        id : nanoid(),
        originalUrl,
        shortCode,
        clicks: 0,
        createdAt: new Date(),
    }

    urlDatabase.push(newUrl);
    return res.status(201).json({
        msg: "Short URL created successfully",
        data: newUrl
    })
})

app.get('/:shortCode', (req,res)=>{
    const { shortCode } = req.params
    //finding url in arr
    const urlEntry = urlDatabase.find((entry) => entry.shortCode === shortCode)

    if(!urlEntry){
        return res.status(404).json({
            msg: "URL entry not found"
        })
    }
    urlEntry.clicks++
    res.redirect(urlEntry.originalUrl)
})

app.get('/api/analytics/:shortCode', (req,res)=>{
    const { shortCode } = req.params
    const urlEntry = urlDatabase.find((entry) => entry.shortCode === shortCode)

    if(!urlEntry){
        return res.status(404).json({
            msg: "URL entry not found"
        })
    }

    return res.status(200).json({
        msg: "Analytics fetched successfully",
        data: urlEntry
    });

})



const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
})
