const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME || "gemini-3-flash-preview";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for image uploads
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG files are allowed"));
    }
  },
});

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "MedScribe AI Backend is running" });
});

// POST /soap-note - Generate SOAP note from consultation summary
app.post("/soap-note", async (req, res) => {
  try {
    const { summary, language } = req.body;

    if (!summary || summary.trim() === "") {
      return res.status(400).json({ error: "Summary is required" });
    }

    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not configured" });
    }

    const validLanguages = ["english", "hindi"];
    const lang = (language || "english").toLowerCase();
    if (!validLanguages.includes(lang)) {
      return res.status(400).json({
        error: 'Language must be "english" or "hindi"',
      });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const languageInstructions =
      lang === "hindi"
        ? "Write the content of each section in Hindi using Devanagari script, but keep the section headers exactly as SUBJECTIVE, OBJECTIVE, ASSESSMENT, and PLAN."
        : "Write the full SOAP note in English and keep the section headers exactly as SUBJECTIVE, OBJECTIVE, ASSESSMENT, and PLAN.";

    const prompt = `You are a medical assistant. Convert the following clinical consultation summary into a structured SOAP note.

${languageInstructions}

SOAP Format:
SUBJECTIVE: Patient's symptoms and complaints as reported
OBJECTIVE: Observable findings, vital signs, test results
ASSESSMENT: Clinical diagnosis or impression
PLAN: Treatment plan, medications, follow-up

Clinical Summary:
"${summary}"

Return only the SOAP note with no extra introduction.

Generate the SOAP note now:`;

    let soapNote = "";
    try {
      const result = await model.generateContent(prompt);
      soapNote = result.response.text() || "Unable to generate SOAP note";
    } catch (e) {
      console.error("Model generateContent error:", e);
      if (e.message && e.message.includes("not found")) {
        return res.status(502).json({
          error: `Model \"${MODEL_NAME}\" not found for this API version. Run the models list (see Google AI Studio) or set the correct MODEL_NAME in backend/.env.`,
        });
      }
      throw e;
    }

    res.json({ soap: soapNote });
  } catch (error) {
    console.error("Error generating SOAP note:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /explain-rx - Explain prescription from image
app.post("/explain-rx", upload.single("image"), async (req, res) => {
  let imagePath = null;
  try {
    const { language } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const validLanguages = ["english", "hindi"];
    const lang = (language || "english").toLowerCase();
    if (!validLanguages.includes(lang)) {
      return res
        .status(400)
        .json({
          error: 'Language must be "english" or "hindi"',
        });
    }

    if (!GEMINI_API_KEY) {
      return res
        .status(500)
        .json({ error: "GEMINI_API_KEY is not configured" });
    }

    imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const languageInstructions =
      lang === "hindi"
        ? "Respond in Hindi (Devanagari script)"
        : "Respond in English";

    const prompt = `You are a pharmacist. Analyze this prescription image and explain the medicines. ${languageInstructions}

For each medicine, provide:
1. Medicine name
2. Used for: [condition/purpose]
3. Side effects: [common side effects]
4. Warnings: [any important warnings or precautions]

Format the output clearly with each medicine as a separate block.

Prescription Image Analysis:`;

    let explanation = "";
    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
        prompt,
      ]);

      explanation = result.response.text() || "Unable to explain prescription";
    } catch (e) {
      console.error("Model generateContent error:", e);
      if (e.message && e.message.includes("not found")) {
        return res.status(502).json({
          error: `Model \"${MODEL_NAME}\" not found for this API version. Run the models list (see Google AI Studio) or set the correct MODEL_NAME in backend/.env.`,
        });
      }
      throw e;
    }

    res.json({ explanation: explanation });
  } catch (error) {
    console.error("Error explaining prescription:", error);
    res.status(500).json({ error: error.message });
  } finally {
    // Delete the uploaded file after processing
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
});

// GET /models - list available models from Google Generative Language API
app.get('/models', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text();
      console.error('Models list fetch failed:', resp.status, text);
      return res.status(502).json({ error: 'Failed to fetch models list', detail: text });
    }
    const data = await resp.json();
    return res.json(data);
  } catch (err) {
    console.error('Error listing models:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏥 MedScribe AI Backend running on port ${PORT}`);
});
