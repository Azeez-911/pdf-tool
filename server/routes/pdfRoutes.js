const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("PDF API working");
});

module.exports = router;