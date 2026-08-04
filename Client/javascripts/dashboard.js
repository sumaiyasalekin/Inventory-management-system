async function loadDashboard() {
  try {
    const transRes = await fetch("http://localhost:5000/transactions");
    const transactions = await transRes.json();

    const prodRes = await fetch("http://localhost:5000/products");
    const products = await prodRes.json();

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentMonth = today.getMonth();

    // --------- Calculate Sales ---------
    let totalToday = 0,
      totalMonth = 0,
      totalAllTime = 0;
    transactions.forEach((t) => {
      if (t.paymentStatus.toLowerCase() === "paid") {
        totalAllTime += t.totalPrice;
        const tDate = new Date(t.date);
        if (t.date.slice(0, 10) === todayStr) totalToday += t.totalPrice;
        if (tDate.getMonth() === currentMonth && tDate.getFullYear() === today.getFullYear())
          totalMonth += t.totalPrice;
      }
    });

    document.getElementById("sales-today").innerText = `$${totalToday}`;
    document.getElementById("sales-month").innerText = `$${totalMonth}`;
    document.getElementById("sales-alltime").innerText = `$${totalAllTime}`;

    // -------- Recent Transactions ------------
    const tbody = document.getElementById("recent-transactions");
    tbody.innerHTML = "";
    transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .forEach((t) => {
        const timeStr = new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const tr = document.createElement("tr");
        tr.innerHTML = `
              <td>${t.transactionId}</td>
              <td>${t.totalItems}</td>
              <td>${new Date(t.date).toLocaleDateString()}</td>
              <td>${timeStr}</td>
              <td>${t.customer}</td>
              <td>$${t.totalPrice}</td>
              <td class="status ${t.paymentStatus.toLowerCase()}"><span>${t.paymentStatus}</span></td>
            `;
        tbody.appendChild(tr);
      });

    // ---------- Low Stock Products --------
    const stockContainer = document.getElementById("low-stock-cards");
    stockContainer.innerHTML = "";
    products
      .filter((p) => p.stock <= 5)
      .forEach((p) => {
        const div = document.createElement("div");
        div.classList.add("low-stock-card");
        div.innerHTML = `
              <img src="${p.imageLink}" alt="${p.name}" class="product-image">
              <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-stock">Only ${p.stock} left</p>
                <p class="product-price">$${p.price}</p>
              </div>
            `;
        stockContainer.appendChild(div);
      });
  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}

window.addEventListener("DOMContentLoaded", loadDashboard);
