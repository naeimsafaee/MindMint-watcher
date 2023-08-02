const router = require("express").Router();

router.get('/', (req , res) => {
    return res.send("Working...")
});

module.exports = router