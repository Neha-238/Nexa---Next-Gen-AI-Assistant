import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

app.post("/api/generate", async (req, res) => {
  try {
    const { contents } = req.body;
    const promptText = contents?.[0]?.parts?.[0]?.text || "";
    const inlineData = contents?.[0]?.parts?.[1]?.inline_data;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                ...(inlineData ? [{ inline_data: inlineData }] : []),
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
