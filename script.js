
// CAMPUSCARE - MAIN JAVASCRIPT

let complaints = JSON.parse(
    localStorage.getItem("campuscare_complaints") || "[]"
);

// SAVE COMPLAINTS
function saveComplaints() {
    localStorage.setItem(
        "campuscare_complaints",
        JSON.stringify(complaints)
    );
}

// SHOW NOTIFICATION
function toast(message) {
    const element = document.getElementById("toast");
    element.textContent = message;
    element.classList.add("show");

    setTimeout(() => {
        element.classList.remove("show");
    }, 2500);
}

// ESCAPE USER INPUT BEFORE DISPLAYING HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[character]));
}

// NAVIGATION
function showPage(page) {
    document.querySelectorAll(".page").forEach(section => {
        section.classList.remove("active");
    });

    document.getElementById("page-" + page)
        .classList.add("active");

    document.querySelectorAll("nav button").forEach(button => {
        button.classList.remove("active");
    });

    const navButton = document.getElementById("nav-" + page);

    if (navButton) {
        navButton.classList.add("active");
    }

    if (page === "dashboard") renderDashboard();
    if (page === "track") renderComplaints();
    if (page === "admin") renderAdmin();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// STATUS DESIGN
function statusClass(status) {
    if (status === "Resolved") return "resolved";
    if (status === "In Progress") return "progress";
    return "";
}

// COMPLAINT CARD
function complaintCard(c, admin = false) {

    return `
    <article class="complaint-card">

        <div class="complaint-top">

            <div>
                <div class="complaint-title">
                    ${escapeHTML(c.title)}
                </div>

                <div class="complaint-meta">
                    ID: <strong>${escapeHTML(c.id)}</strong><br>
                    Category: ${escapeHTML(c.category)}<br>
                    Location: ${escapeHTML(c.building)},
                    ${escapeHTML(c.room)}<br>
                    Student: ${escapeHTML(c.name)}
                    (${escapeHTML(c.studentId)})<br>
                    Date: ${escapeHTML(c.date)}
                </div>
            </div>

            <div>
                <span class="pill ${statusClass(c.status)}">
                    ${escapeHTML(c.status)}
                </span>

                <div class="priority ${c.priority.toLowerCase()}">
                    ${escapeHTML(c.priority)} Priority
                </div>
            </div>

        </div>

        <p class="complaint-description">
            ${escapeHTML(c.description)}
        </p>

        ${admin ? `
            <div class="admin-actions">
                <button class="small-btn"
                    onclick="setComplaintStatus('${c.id}','Submitted')">
                    Submitted
                </button>

                <button class="small-btn"
                    onclick="setComplaintStatus('${c.id}','In Progress')">
                    In Progress
                </button>

                <button class="small-btn"
                    onclick="setComplaintStatus('${c.id}','Resolved')">
                    Resolved
                </button>
            </div>
        ` : ""}

    </article>
    `;
}

// DASHBOARD
function renderDashboard() {

    const total = complaints.length;

    const pending = complaints.filter(
        c => c.status === "Submitted"
    ).length;

    const resolved = complaints.filter(
        c => c.status === "Resolved"
    ).length;

    document.getElementById("dashboard-stats").innerHTML = `

        <div class="stat">
            <span>Total Complaints</span>
            <strong>${total}</strong>
        </div>

        <div class="stat">
            <span>Awaiting Action</span>
            <strong>${pending}</strong>
        </div>

        <div class="stat">
            <span>Resolved Issues</span>
            <strong>${resolved}</strong>
        </div>

    `;

    const recent = document.getElementById("recent-list");

    recent.innerHTML = complaints.length
        ? complaints.slice(0, 3).map(c => complaintCard(c)).join("")
        : `<div class="empty">
            <h3>No Complaints Yet</h3>
            <p>Be the first to report a campus issue!</p>
           </div>`;
}

// SUBMIT COMPLAINT
document.getElementById("complaint-form")
.addEventListener("submit", function(event) {

    event.preventDefault();

    const complaint = {

        id: "CC" + Date.now(),

        name: document.getElementById("student-name")
            .value.trim(),

        studentId: document.getElementById("student-id")
            .value.trim(),

        category: document.getElementById("category").value,

        priority: document.getElementById("priority").value,

        building: document.getElementById("building")
            .value.trim(),

        room: document.getElementById("room")
            .value.trim(),

        title: document.getElementById("title")
            .value.trim(),

        description: document.getElementById("description")
            .value.trim(),

        status: "Submitted",

        date: new Date().toLocaleString()
    };

    complaints.unshift(complaint);

    saveComplaints();

    this.reset();

    alert(
        "Complaint submitted successfully!\n\n" +
        "Your Complaint ID: " + complaint.id +
        "\n\nSave this ID to track your complaint."
    );

    showPage("track");

    document.getElementById("track-search").value =
        complaint.id;

    renderComplaints();
});

// SEARCH AND FILTER COMPLAINTS
function renderComplaints() {

    const root = document.getElementById("complaint-list");

    const search = document.getElementById("track-search")
        .value.toLowerCase().trim();

    const filter = document.getElementById("status-filter")
        .value;

    const filtered = complaints.filter(c => {

        const matchesStatus =
            filter === "All" || c.status === filter;

        const matchesSearch = [
            c.id,
            c.name,
            c.studentId,
            c.title,
            c.category,
            c.building,
            c.room
        ].some(value =>
            value.toLowerCase().includes(search)
        );

        return matchesStatus && matchesSearch;
    });

    root.innerHTML = filtered.length
        ? filtered.map(c => complaintCard(c)).join("")
        : `<div class="panel empty">
            <h3>No Matching Complaints</h3>
            <p>Try another search.</p>
           </div>`;
}

// ADMIN DASHBOARD
function renderAdmin() {

    const total = complaints.length;

    const progress = complaints.filter(
        c => c.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
        c => c.status === "Resolved"
    ).length;

    document.getElementById("admin-stats").innerHTML = `

        <div class="stat">
            <span>All Complaints</span>
            <strong>${total}</strong>
        </div>

        <div class="stat">
            <span>In Progress</span>
            <strong>${progress}</strong>
        </div>

        <div class="stat">
            <span>Resolved</span>
            <strong>${resolved}</strong>
        </div>

    `;

    const root = document.getElementById("admin-list");

    root.innerHTML = complaints.length
        ? complaints.map(c => complaintCard(c, true)).join("")
        : `<div class="empty">
            <h3>No Complaints Available</h3>
           </div>`;
}

// UPDATE COMPLAINT STATUS
function setComplaintStatus(id, status) {

    const complaint = complaints.find(c => c.id === id);

    if (complaint) {

        complaint.status = status;

        saveComplaints();

        renderAdmin();
        renderDashboard();
        renderComplaints();

        toast("Complaint status updated successfully!");
    }
}

// INITIALIZE WEBSITE
renderDashboard();
