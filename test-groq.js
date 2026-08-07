const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function test() {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: "Bonjour, réponds simplement : ça marche !"
                }
            ],
            model: "llama-3.1-8b-instant"
        });

        console.log(response.choices[0].message.content);

    } catch (error) {
        console.log(error);
    }
}

test();
