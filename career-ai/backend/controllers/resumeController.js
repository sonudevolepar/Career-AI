const PDFParser = require('pdf2json');
const { analyzeResumeWithAI } = require('../services/aiService');

const extractTextFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {

    const pdfParser = new PDFParser(null, 1);

    pdfParser.on(
      'pdfParser_dataError',
      (errData) => {
        reject(errData.parserError);
      }
    );

    pdfParser.on(
      'pdfParser_dataReady',
      () => {
        resolve(
          pdfParser.getRawTextContent()
        );
      }
    );

    pdfParser.parseBuffer(buffer);
  });
};

const analyzeResume = async (req, res) => {
  try {

    // Check PDF
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF resume.'
      });
    }

    // Get target role
    const { targetRole } = req.body;

    if (!targetRole || targetRole.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide target job role.'
      });
    }

    // Extract PDF text
    const resumeText =
      await extractTextFromBuffer(req.file.buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF.'
      });
    }

    console.log('Target Role:', targetRole);
    console.log('Resume Text Length:', resumeText.length);

    // AI Analysis
    const analysis =
      await analyzeResumeWithAI(
        resumeText,
        targetRole
      );

    console.log('AI Analysis:', analysis);

    // Response
    return res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {

    console.error(
      'Resume Analysis Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: error.message
    });
  }
};

module.exports = {
  analyzeResume
};