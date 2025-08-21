let clients = JSON.parse(localStorage.getItem("clients")) || [];

// sample clients
if (clients.length === 0) {
    clients = [
        {
            id: Date.now() + 1,
            name: "Alice",
            email: "alice@example.com",
            company: "Tech Solutions",
            notes: "Interested in web services."
        },
        {
            id: Date.now() + 2,
            name: "Mohammad",
            email: "rahimi@gmail.com",
            company: "Global Trade Ltd.",
            notes: "Requested a follow-up meeting."
        },
        {
            id: Date.now() + 3,
            name: "Sara",
            email: "sara@example.com",
            company: "Creative Studio",
            notes: "graphic design support."
        }
    ];
    localStorage.setItem("clients", JSON.stringify(clients));
}

const clientForm = document.getElementById("clientForm");
const clientsTableBody = document.getElementById("clientsTableBody");

function saveClients() {
    localStorage.setItem("clients", JSON.stringify(clients));
}

function renderClients() {
    clientsTableBody.innerHTML = "";
    clients.forEach(client => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${client.name}</td>
            <td>${client.email}</td>
            <td>${client.company || ""}</td>
            <td>${client.notes || ""}</td>
            <td class="actions">
                <button onclick="editClient(${client.id})">Edit</button>
                <button onclick="deleteClient(${client.id})" style="background:linear-gradient(135deg,#ff4b2b,#ff416c)">Delete</button>
            </td>
        `;
        clientsTableBody.appendChild(tr);
    });
}

clientForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const company = document.getElementById("company").value.trim();
    const notes = document.getElementById("notes").value.trim();

    if (!name || !email) {
        alert("Name and Email are required!");
        return;
    }

    const newClient = {
        id: Date.now(),
        name,
        email,
        company,
        notes
    };

    clients.push(newClient);
    saveClients();
    renderClients();
    clientForm.reset();
});

window.editClient = function(id) {
    const client = clients.find(c => c.id === id);
    if (!client) return;

    document.getElementById("name").value = client.name;
    document.getElementById("email").value = client.email;
    document.getElementById("company").value = client.company;
    document.getElementById("notes").value = client.notes;

    deleteClient(id); 
}
window.deleteClient = function(id) {
    clients = clients.filter(c => c.id !== id);
    saveClients();
    renderClients();
}

renderClients();
