const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Méthode non autorisée"
        });
    }

    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Message vide"
            });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "Tu es Meliodas AI, un assistant intelligent, utile et respectueux. Réponds en français sauf si l'utilisateur demande une autre langue."
                },
                {
                    role: "user",
                    content: message
                }
            ]
        });

        const reply = completion.choices[0].message.content;

        return res.status(200).json({
            reply: reply
        });

    } catch (error) {
        console.error("Erreur Groq :", error);

        return res.status(500).json({
            error: "Erreur avec Meliodas AI"
        });
    }
};
