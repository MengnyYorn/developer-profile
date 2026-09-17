const initialServers = [
    { id: crypto.randomUUID(), name: "waf-node-01", host: "192.168.0.61", environment: "lab", status: "online" },
    { id: crypto.randomUUID(), name: "db-primary", host: "10.0.0.12", environment: "production", status: "online" }
];

let servers = JSON.parse(localStorage.getItem("servers")) || initialServers;

const serverForm = document.querySelector("#server-form");
const serverIdInput = document.querySelector("#server-id");
const nameInput = document.querySelector("#server-name");
const hostInput = document.querySelector("#server-host");
const envInput = document.querySelector("#server-env");
const statusInput = document.querySelector("#server-status");
const cancelBtn = document.querySelector("#cancel-btn");
const saveBtn = document.querySelector("#save-btn");
const formTitle = document.querySelector("#form-title");

const searchInput = document.querySelector("#search-input");
const filterEnv = document.querySelector("#filter-env");
const filterStatus = document.querySelector("#filter-status");

const serverList = document.querySelector("#server-list");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");
const onlineCount = document.querySelector("#online-count");
const offlineCount = document.querySelector("#offline-count");

function saveAndRender() {
    localStorage.setItem("servers", JSON.stringify(servers));
    render();
}

function render() {
    serverList.innerHTML = "";
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const envVal = filterEnv.value;
    const statusVal = filterStatus.value;

    const filtered = servers.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm) || s.host.toLowerCase().includes(searchTerm);
        const matchesEnv = envVal === "all" || s.environment === envVal;
        const matchesStatus = statusVal === "all" || s.status === statusVal;
        return matchesSearch && matchesEnv && matchesStatus;
    });

    emptyState.style.display = filtered.length === 0 ? "block" : "none";

    filtered.forEach(s => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td>${escapeHtml(s.host)}</td>
            <td>${s.environment}</td>
            <td><span class="badge badge-${s.status}">${s.status}</span></td>
            <td>
                <button class="btn-edit" onclick="editServer('${s.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteServer('${s.id}')">Delete</button>
            </td>
        `;
        serverList.appendChild(tr);
    });

    totalCount.textContent = servers.length;
    onlineCount.textContent = servers.filter(s => s.status === "online").length;
    offlineCount.textContent = servers.filter(s => s.status === "offline").length;
}

serverForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = serverIdInput.value;

    if (id) {
        servers = servers.map(s => s.id === id ? {
            ...s,
            name: nameInput.value.trim(),
            host: hostInput.value.trim(),
            environment: envInput.value,
            status: statusInput.value
        } : s);
    } else {

        servers.push({
            id: crypto.randomUUID(),
            name: nameInput.value.trim(),
            host: hostInput.value.trim(),
            environment: envInput.value,
            status: statusInput.value
        });
    }

    resetForm();
    saveAndRender();
});

function editServer(id) {
    const s = servers.find(item => item.id === id);
    if (!s) return;
    
    serverIdInput.value = s.id;
    nameInput.value = s.name;
    hostInput.value = s.host;
    envInput.value = s.environment;
    statusInput.value = s.status;

    formTitle.textContent = "Edit Server";
    saveBtn.textContent = "Update Server";
    cancelBtn.style.display = "inline-block";
}

function deleteServer(id) {
    if (confirm("Are you sure you want to delete this server?")) {
        servers = servers.filter(s => s.id !== id);
        saveAndRender();
    }
}

function resetForm() {
    serverIdInput.value = "";
    serverForm.reset();
    formTitle.textContent = "Add New Server";
    saveBtn.textContent = "Add Server";
    cancelBtn.style.display = "none";
}

cancelBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", render);
filterEnv.addEventListener("change", render);
filterStatus.addEventListener("change", render);

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Initial Run
render();