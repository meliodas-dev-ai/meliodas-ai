const input = document.querySelector(".message-input");
const sendBtn = document.querySelector(".send-btn");
const messagesContainer = document.querySelector(".messages-container");

async function sendMessage() {
    const message = input.value.trim();

    if (!message) return;

    // Afficher le message de l'utilisateur
    messagesContainer.innerHTML += `
        <div class="message-bubble user-message">
            <div class="message-content user-content">
                <p>${escapeHTML(message)}</p>
            </div>
        </div>
    `;

    input.value = "";
    sendBtn.disabled = true;

    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Erreur du serveur");
        }

        // Afficher la réponse de Meliodas AI
        messagesContainer.innerHTML += `
            <div class="message-bubble ai-message">
                <div class="message-content ai-content">
                    <p>${escapeHTML(data.reply || "Je n'ai pas reçu de réponse.")}</p>
                    <div class="message-time">
                        ${new Date().toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);

        messagesContainer.innerHTML += `
            <div class="message-bubble ai-message">
                <div class="message-content ai-content">
                    <p>Erreur de connexion avec Meliodas AI.</p>
                </div>
            </div>
        `;
    } finally {
        sendBtn.disabled = false;
        input.focus();
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Empêche l'injection de HTML dans les messages
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Bouton Envoyer
sendBtn.addEventListener("click", sendMessage);

// Entrée = envoyer
// Shift + Entrée = nouvelle ligne
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
