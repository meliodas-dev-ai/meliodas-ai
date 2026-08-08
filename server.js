require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY est manquante.");
    process.exit(1);
}

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());

// Servir les fichiers du site
app.use(express.static(path.join(__dirname)));

app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message || typeof message !== "string") {
            return res.status(400).json({
                error: "Message invalide."
            });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content:
                        "Tu es Meliodas AI, un assistant intelligent, utile et respectueux. Réponds en français sauf si l'utilisateur demande une autre langue."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const reply =
            response.choices?.[0]?.message?.content ||
            "Je n'ai pas pu générer une réponse.";

        res.json({ reply });

    } catch (error) {
        console.error("❌ Erreur Groq :", error);

        res.status(500).json({
            error: "Impossible d'obtenir une réponse de Meliodas AI."
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Meliodas AI lancé sur le port ${PORT}`);
});            
