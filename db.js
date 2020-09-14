const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/image-board"
);

//////////////////////// Q U E R I E S ////////////////////
module.exports.getImages = () => {
    return db.query(
        `SELECT * FROM images`
    );
};