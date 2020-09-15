//////////////////////// SET UP ///////////////////////
const express = require('express');
const app = express();
const db = require('./db');
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require('./s3');
const { s3Url } = require('./config');

app.use(express.static('public'));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});


//////////////////////// REQUESTS ////////////////////////

app.get('/images', (req, res) => {
   
    db.getImages()
        .then(({ rows:images }) => {
            res.json({
                images
            });
        })
        .catch(err => console.log('err in getImages: ', err));

});



app.post('/upload', uploader.single("file"), s3.upload, (req, res) => {

    console.log('REQ.BODY IN POST ON /upload: ', req.body);

    if (req.file) {

        // console.log(req.file);

        const filename = req.file.filename;
        const url = `${s3Url}${filename}`;

        db.addImage(url, req.body.username, req.body.title, req.body.description)
            .then(({ rows }) => {
                // console.log('ROWS IN addImage: ', rows);
                // in rows i'm getting an array with the newly inserted row in it
                // console.log('ROWS[0]: ', rows[0]);
                res.json(rows[0]);

            })
            .catch(err => console.log('err in addImage: ', err));
    }



});

app.listen(8080, () => console.log('imgboard server is listening! 🎧'));