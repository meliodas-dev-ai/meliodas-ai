const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama-3.1-8b-instant"
        });

        res.json({
            reply: response.choices[0].message.content
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "Erreur serveur"
        });
    }
});

app.listen(3000, () => {
    console.log("Meliodas AI serveur lancé sur le port 3000");
});
