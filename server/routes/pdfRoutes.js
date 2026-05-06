const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  mergePDFs,
  splitPDF,
  compressPDF
} = require("../controllers/pdfController");
console.log("compressPDF:", compressPDF);
console.log({
  mergePDFs,
  splitPDF,
  compressPDF
});

const upload = multer({ dest: "uploads/" });
router.get("/check", (req, res) => {
  res.send("compress route file loaded");
});
router.post("/merge", upload.array("files"), mergePDFs);

router.post("/split", upload.single("file"), splitPDF);

router.post("/compress", upload.single("file"), (req, res, next) => {
  console.log("compress route hit");
  next();
}, compressPDF);
module.exports = router;