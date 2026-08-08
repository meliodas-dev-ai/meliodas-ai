const input = document.querySelector(".message-input");
const sendBtn = document.querySelector(".send-btn");
const messagesContainer = document.querySelector(".messages-container");

const sidebar = document.getElementById("sidebar");
const menuToggleBtn = document.getElementById("menuToggleBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const mobileOverlay = document.getElementById("mobileOverlay");
const newConversationBtn = document.getElementById("newConversationBtn");

// ===============================
// PROTECTION HTML
// ===============================

function escapeHTML(text) {
const div = document.createElement("div");
div.textContent = text;
return div.innerHTML;
}

// ===============================
// OUVRIR LE MENU
// ===============================

if (menuToggleBtn) {
menuToggleBtn.addEventListener("click", () => {
sidebar.classList.add("active");
mobileOverlay.classList.add("active");
});
}

// ===============================
// FERMER LE MENU
// ===============================

function closeSidebar() {
sidebar.classList.remove("active");
mobileOverlay.classList.remove("active");
}

if (closeSidebarBtn) {
closeSidebarBtn.addEventListener("click", closeSidebar);
}

if (mobileOverlay) {
mobileOverlay.addEventListener("click", closeSidebar);
}

// ===============================
// NOUVELLE CONVERSATION
// ===============================

if (newConversationBtn) {
newConversationBtn.addEventListener("click", () => {

    messagesContainer.innerHTML = `
        <div class="message-bubble ai-message">

            <div class="message-avatar ai-avatar">
                <div class="avatar-dot"></div>
            </div>

            <div class="message-content ai-content">

                <p>
                    Nouvelle conversation créée.
                    Comment puis-je t'aider ?
                </p>

                <div class="message-time">
                    Maintenant
                </div>

            </div>

        </div>
    `;

    input.value = "";
    input.focus();

    closeSidebar();
});

}

// ===============================
// ENVOYER UN MESSAGE
// ===============================

async function sendMessage() {

const message = input.value.trim();

if (!message || sendBtn.disabled) {
    return;
}

// Message utilisateur
messagesContainer.innerHTML += `
    <div class="message-bubble user-message">

        <div class="message-content user-content">

            <p>${escapeHTML(message)}</p>

            <div class="message-time">
                ${new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
            </div>

        </div>

    </div>
`;

// Nettoyer la zone de saisie
input.value = "";

// Désactiver le bouton pendant la réponse
sendBtn.disabled = true;

messagesContainer.scrollTop =
    messagesContainer.scrollHeight;


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
        throw new Error(
            data.error || "Erreur du serveur."
        );
    }


    // Réponse de Meliodas AI
    messagesContainer.innerHTML += `
        <div class="message-bubble ai-message">

            <div class="message-avatar ai-avatar">
                <div class="avatar-dot"></div>
            </div>

            <div class="message-content ai-content">

                <p>
                    ${escapeHTML(
                        data.reply ||
                        "Je n'ai pas reçu de réponse."
                    )}
                </p>

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

    console.error(
        "Erreur de connexion :",
        error
    );

    messagesContainer.innerHTML += `
        <div class="message-bubble ai-message">

            <div class="message-avatar ai-avatar">
                <div class="avatar-dot"></div>
            </div>

            <div class="message-content ai-content">

                <p>
                    ❌ Impossible de contacter Meliodas AI.
                    Vérifie que le serveur est bien démarré.
                </p>

            </div>

        </div>
    `;

} finally {

    sendBtn.disabled = false;

    input.focus();

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;
}

}

// ===============================
// BOUTON ENVOYER
// ===============================

if (sendBtn) {
sendBtn.addEventListener(
"click",
sendMessage
);
}

// ===============================
// TOUCHE ENTRÉE
// ===============================

if (input) {

input.addEventListener(
    "keydown",
    (event) => {

        // Entrée = envoyer
        // Shift + Entrée = nouvelle ligne

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();
        }
    }
);

}

// ===============================
// PARAMÈTRES
// ===============================

const settingsBtn =
document.querySelector(".settings-btn");

if (settingsBtn) {

settingsBtn.addEventListener(
    "click",
    () => {

        alert(
            "⚙️ Les paramètres de Meliodas AI seront disponibles prochainement."
        );

    }
);

}
