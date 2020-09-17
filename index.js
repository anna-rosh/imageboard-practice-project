//////////////////////// SET UP ///////////////////////
const express = require('express');
const app = express();
const db = require('./db');
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require('./s3');
const { s3Url } = require('./config');

app.use(express.json());

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
    // console.log('REQ.BODY IN POST ON /upload: ', req.body);
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

// GET will get the id of the clicked image in the dynamic path.
app.get('/information/:imageId', (req, res) => {
    // the id of the clicked image is accessible in req.params
    db.getClickedImageInfo(req.params.imageId)
        .then(({ rows }) => {
            // console.log('ROWS IN getClickedImageInfo: ', rows);
            res.json(rows[0]);            
        })
        .catch(err => console.log('err in getClickedImageInfo: ', err));

});

app.get('/comments/:imageId', (req, res) => {

    db.getComments(req.params.imageId)
        .then(({ rows:comments }) => {

            res.json({
                comments
            });
        })
        .catch(err => console.log('err in getComments: ', err));
});


app.post('/comment/:imageId', (req, res) => {
    // console.log('imageId in params: ', req.params);
    // console.log('req.body in POST comment: ', req.body);
    const { username, comment } = req.body;

    db.addComment(username, comment, req.params.imageId)
        .then(({ rows:addedComment }) => {

            res.json(addedComment[0]);
        })
        .catch(err => console.log('err in addComment: ', err));
});

// i am getting the information about the lowest id from script.js
app.get('/more-images/:lowestId', (req, res) => {

    db.getMoreImages(req.params.lowestId)
        .then(({ rows }) => {
            // console.log(rows);
            res.json(rows);
        })
        .catch(err => console.log('err in getMoreImages: ', err));

});

app.listen(8080, () => console.log('imgboard server is listening! 🎧'));