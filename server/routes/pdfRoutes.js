const express = require("express");
const router = express.Router();
const multer = require("multer");

const { mergePDFs, splitPDF } = require("../controllers/pdfController");

const upload = multer({ dest: "uploads/" });

router.post("/merge", upload.array("files"), mergePDFs);
router.post("/split", upload.single("file"), splitPDF);

module.exports = router;