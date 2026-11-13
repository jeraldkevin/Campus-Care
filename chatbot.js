
// CAMPUSCARE CHATBOT
// Offline JavaScript FAQ assistant

const launcher = document.getElementById("chat-launcher");
const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// OPEN AND CLOSE CHATBOT
function toggleChat(open) {

    const shouldOpen = typeof open === "boolean"
        ? open
        : !chatWindow.classList.contains("open");

    chatWindow.classList.toggle("open", shouldOpen);

    if (shouldOpen) {
        chatInput.focus();
    }
}

launcher.addEventListener("click", () => toggleChat());

document.getElementById("chat-close")
    .addEventListener("click", () => toggleChat(false));

// DISPLAY CHAT MESSAGE
function addMessage(text, sender) {

    const message = document.createElement("div");

    message.className =
        sender === "user"
            ? "message user-message"
            : "message bot-message";

    message.textContent = text;

    chatMessages.appendChild(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// CHATBOT RESPONSE LOGIC
function botReply(question) {

    const q = question.toLowerCase();

    // GREETINGS
    if (/\b(hi|hello|hey)\b/.test(q)) {
        return "Hello! 👋 Welcome to CampusCare. How can I help you today?";
    }

    // REPORT COMPLAINT
    if (
        q.includes("report") ||
        q.includes("submit") ||
        q.includes("raise a complaint")
    ) {
        return `To report a complaint:

1. Open Report Issue.
2. Enter your name and student ID.
3. Select the complaint category.
4. Choose the priority.
5. Enter the building and room.
6. Describe the issue.
7. Click Submit Complaint.

Your complaint ID will be generated automatically!`;
    }

    // TRACK COMPLAINT
    if (
        q.includes("track") ||
        q.includes("find complaint") ||
        q.includes("complaint id")
    ) {
        return `To track your complaint:

1. Open Track Complaints.
2. Enter your complaint ID.
3. You can also search using your name or student ID.
4. Check the current complaint status.`;
    }

    // STATUS
    if (
        q.includes("status") ||
        q.includes("submitted") ||
        q.includes("resolved") ||
        q.includes("progress")
    ) {
        return `There are three complaint statuses:

🟡 Submitted:
Your complaint has been received.

🔵 In Progress:
The maintenance team is working on it.

🟢 Resolved:
The issue has been marked as fixed.`;
    }

    // CATEGORY
    if (
        q.includes("category") ||
        q.includes("electrical") ||
        q.includes("plumbing") ||
        q.includes("wifi") ||
        q.includes("cleanliness")
    ) {
        return `CampusCare supports these categories:

• Electrical
• Plumbing
• Classroom Facilities
• Cleanliness
• Internet / Wi-Fi
• Furniture
• Other`;
    }

    // PRIORITY
    if (
        q.includes("priority") ||
        q.includes("urgent")
    ) {
        return `There are three priority levels:

🔴 High: Urgent campus issues.
🟠 Medium: Issues needing attention soon.
🟢 Low: Minor maintenance issues.

Please choose the priority responsibly.`;
    }

    // ADMIN
    if (
        q.includes("admin") ||
        q.includes("maintenance team")
    ) {
        return `The Admin Dashboard allows maintenance staff to:

• View all complaints.
• Check complaint details.
• Change complaint status.
• Mark issues as resolved.

This demonstration version does not include admin login.`;
    }

    // PRIVACY
    if (
        q.includes("privacy") ||
        q.includes("data") ||
        q.includes("safe")
    ) {
        return `This is a classroom demonstration project.

Complaint information is saved in your browser using LocalStorage. It is not shared with a college server.

Avoid entering sensitive personal information.`;
    }

    // THANK YOU
    if (
        q.includes("thank") ||
        q.includes("thanks")
    ) {
        return "You're welcome! 😊 Thank you for helping improve our campus.";
    }

    // DEFAULT RESPONSE
    return `Sorry, I couldn't understand that question.

You can ask me:

• How do I report an issue?
• How can I track my complaint?
• What are the complaint statuses?
• What priority should I choose?
• What categories are available?`;
}

// SEND MESSAGE
function sendMessage(text) {

    const message = text.trim();

    if (!message) return;

    addMessage(message, "user");

    chatInput.value = "";

    setTimeout(() => {

        const answer = botReply(message);

        addMessage(answer, "bot");

    }, 300);
}

// CHAT FORM
document.getElementById("chat-form")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        sendMessage(chatInput.value);

    });

// QUICK QUESTION BUTTONS
document.querySelectorAll(".quick-questions button")
    .forEach(button => {

        button.addEventListener("click", () => {

            sendMessage(button.dataset.question);

        });

    });
