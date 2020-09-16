const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/image-board"
);

//////////////////////// Q U E R I E S ////////////////////
module.exports.getImages = () => {
    return db.query(
        `SELECT * FROM images
        ORDER BY id DESC`
    );
};


module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING url, username, title, description`,
        [url, username, title, description]
    );
};



module.exports.getClickedImageInfo = (id) => {
    return db.query(
        `SELECT * FROM images
        WHERE id = $1`,
        [id]
    );
};

module.exports.getComments = (imageId) => {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1`,
        [imageId]
    );
};