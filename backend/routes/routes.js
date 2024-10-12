const pool = require("../database/db-connection");
const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Hello world!");
});

module.exports = router;