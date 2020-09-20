const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/image-board"
);

//////////////////////// Q U E R I E S ////////////////////
module.exports.getImages = () => {
    return db.query(
        `SELECT * FROM images
        ORDER BY id DESC
        LIMIT 3`
    );
};

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id, url, username, title, description, created_at`,
        [url, username, title, description]
    );
};

module.exports.getClickedImageInfo = (id) => {
    return db.query(
        `SELECT *, (
            SELECT id FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 1
            ) AS prev, (
            SELECT id FROM images
            WHERE id > $1
            ORDER BY id ASC
            LIMIT 1
            ) AS next
        FROM images
        WHERE id = $1`,
        [id]
    );
};

module.exports.getComments = (imageId) => {
    return db.query(
        `SELECT * FROM comments
        WHERE image_id = $1
        ORDER BY id DESC`,
        [imageId]
    );
};

module.exports.addComment = (username, comment, imageId) => {
    return db.query(
        `INSERT INTO comments (username, comment, image_id)
        VALUES ($1, $2, $3)
        RETURNING username, comment, image_id, created_at`,
        [username, comment, imageId]
    );
};

module.exports.getMoreImages = lowestId => {
    return db.query(
        `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3`,
        [lowestId]
    );
};

module.exports.deleteImage = (imageId) => {
    return db.query(
        `DELETE FROM images
        WHERE id = $1`,
        [imageId]
    );
};