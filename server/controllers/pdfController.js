const fs = require("fs");
const { PDFDocument } = require("pdf-lib");

exports.mergePDFs = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length < 2) {
      return res.status(400).send("Upload at least 2 PDFs");
    }

    const mergedPdf = await PDFDocument.create();

    for (let file of files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfFile = await mergedPdf.save();

    const outputPath = `outputs/merged-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, mergedPdfFile);

    res.download(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error merging PDFs");
  }
};
exports.splitPDF = async (req, res) => {
  try {
    const file = req.file;
    const { start, end } = req.body;

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    const pdfBytes = fs.readFileSync(file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const totalPages = pdfDoc.getPageCount();

    const startPage = parseInt(start) - 1;
    const endPage = parseInt(end) - 1;

    if (
      startPage < 0 ||
      endPage >= totalPages ||
      startPage > endPage
    ) {
      return res.status(400).send("Invalid page range");
    }

    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(
      pdfDoc,
      Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
    );

    pages.forEach((page) => newPdf.addPage(page));

    const newPdfBytes = await newPdf.save();

    const outputPath = `outputs/split-${Date.now()}.pdf`;
    fs.writeFileSync(outputPath, newPdfBytes);

    res.download(outputPath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error splitting PDF");
  }
};