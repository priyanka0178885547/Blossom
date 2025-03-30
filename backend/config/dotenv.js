require('dotenv').config();

const PORT = process.env.PORT || 3000;
const USER_DB_URI = process.env.USER_DB_URI;
const FLOWER_DB_URI = process.env.FLOWER_DB_URI;

module.exports = { PORT, USER_DB_URI, FLOWER_DB_URI };

