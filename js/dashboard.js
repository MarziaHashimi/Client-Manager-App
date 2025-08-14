async function loadDashboard() {
    const clients = JSON.parse(localStorage.getItem("clients")) || [];
    const invoices = JSON.parse(localStorage.getItem("invoices")) || [];

    document.getElementById("totalClients").textContent = clients.length;
    document.getElementById("totalInvoices").textContent = invoices.length;

    const totalValue = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
    document.getElementById("totalValue").textContent = `$${totalValue.toFixed(2)}`;

    const paidCount = invoices.filter(inv => inv.paid === true || (inv.status && String(inv.status).toLowerCase() === 'paid')).length;
    const unpaidCount = invoices.length - paidCount;
    document.getElementById("paidUnpaid").textContent = `${paidCount} / ${unpaidCount}`;

    try {
        const res = await fetch("js/quotes.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const quotes = await res.json();

        if (Array.isArray(quotes) && quotes.length > 0) {
            const quoteTextEl = document.getElementById("quoteText");
            const quoteAuthorEl = document.getElementById("quoteAuthor");
            let lastIndex = -1;

            const showRandomQuote = () => {
                let idx;
                do {
                    idx = Math.floor(Math.random() * quotes.length);
                } while (quotes.length > 1 && idx === lastIndex);
                lastIndex = idx;

                const q = quotes[idx] || {};
                quoteTextEl.textContent = q.text || "Stay motivated, keep moving forward.";
                quoteAuthorEl.textContent = `— ${q.author || "Unknown"}`;
            };

            showRandomQuote();
            setInterval(showRandomQuote, 5000);
        }
    } catch (error) {
        console.error("Error loading quotes:", error);
        document.getElementById("quoteText").textContent = "Stay motivated, keep moving forward.";
        document.getElementById("quoteAuthor").textContent = "— Unknown";
    }
}

loadDashboard();
