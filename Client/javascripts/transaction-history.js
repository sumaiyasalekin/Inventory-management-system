const tableBody = document.querySelector("tbody");
const searchInput = document.querySelector(".input-field");
const searchBtn = document.querySelector(".button-primary");

async function loadTransactions(query = "") {
  try {
    let url = "http://localhost:5000/transactions";

    if (query.trim() !== "") {
      url += `?search=${encodeURIComponent(query)}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch transactions");

    const transactions = await res.json();

    tableBody.innerHTML = "";

    if (transactions.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center">No transactions found</td></tr>`;
      return;
    }

    transactions.forEach((tx) => {
      const tr = document.createElement("tr");

      let statusClass = "";
      if (tx.paymentStatus === "Paid") statusClass = "paid";
      else if (tx.paymentStatus === "Pending") statusClass = "pending";
      else if (tx.paymentStatus === "Canceled") statusClass = "canceled";

      tr.innerHTML = `
          <td>#${tx.transactionId}</td>
          <td>${tx.totalItems}</td>
          <td>${tx.date}</td>
          <td>${tx.customer}</td>
          <td>$${tx.totalPrice}</td>
          <td class="status ${statusClass}"><span>${tx.paymentStatus}</span></td>
        `;

      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red">Error loading transactions</td></tr>`;
  }
}

loadTransactions();

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  loadTransactions(query);
});

let debounceTimeout;
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    loadTransactions(searchInput.value.trim());
  }, 500);
});
