const express = require('express');
const app = express();
const db = require('./db');

app.use(express.static('public'));


app.get('/images', (req, res) => {
   
    db.getImages()
        .then(({ rows:images }) => {
            res.json({
                images
            });
        })
        .catch(err => console.log('err in getImages: ', err));

});

app.listen(8080, () => console.log('imgboard server is listening! 🎧'));