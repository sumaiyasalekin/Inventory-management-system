document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".product-input input");
  const addBtn = document.querySelector(".product-input button.button-primary");
  const tableBody = document.querySelector("tbody");
  const totalItemsEl = document.querySelector(".total-section span:nth-child(1)");
  const totalPriceEl = document.querySelector("#totalPriceEl");

  let cart = [];

  const loadingEl = document.createElement("span");
  loadingEl.classList.add("loading-spinner");
  loadingEl.style.display = "none";
  loadingEl.textContent = "Loading...";
  addBtn.parentElement.appendChild(loadingEl);

  addBtn.addEventListener("click", async () => {
    const productId = searchInput.value.trim();
    if (!productId) return alert("Enter Product ID");

    try {
      loadingEl.style.display = "inline-block";
      addBtn.disabled = true;

      const res = await fetch(`http://localhost:5000/products/${productId}`);
      const product = await res.json();

      loadingEl.style.display = "none";
      addBtn.disabled = false;

      if (!res.ok) return alert("Product not found!");

      addToTable(product);
    } catch (err) {
      console.error(err);
      loadingEl.style.display = "none";
      addBtn.disabled = false;
      alert("Server error");
    }
  });

  function addToTable(product) {
    const exists = cart.find((p) => p.productId === product._id);
    if (exists) return alert("Product already added!");

    cart.push({
      productId: product._id,
      name: product.name,
      imageLink: product.imageLink,
      qty: 1,
      price: product.price,
    });

    renderTable();
  }

  function renderTable() {
    tableBody.innerHTML = "";

    cart.forEach((item, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${item.productId}</td>
        <td><img src="${item.imageLink}" class="product-img"></td>
        <td>${item.name}</td>
        <td>
          <input type="number" value="${item.qty}" min="1" class="qty-input" data-index="${index}">
        </td>
        <td>${item.price}</td>
        <td>${item.qty * item.price}</td>
        <td><button class="button button-secondary remove-btn" data-index="${index}">Remove</button></td>
      `;

      tableBody.appendChild(tr);
    });

    updateTotals();
  }

  function updateTotals() {
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      totalItems += item.qty;
      totalPrice += item.qty * item.price;
    });

    totalItemsEl.textContent = totalItems;
    totalPriceEl.innerHTML = totalPrice;
  }

  tableBody.addEventListener("input", (e) => {
    if (e.target.classList.contains("qty-input")) {
      const index = e.target.dataset.index;
      cart[index].qty = parseInt(e.target.value);
      renderTable();
    }
  });

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      renderTable();
    }
  });

  const completeBtn = document.querySelector(".customer-info .button-primary");

  completeBtn.addEventListener("click", async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      totalItems += item.qty;
      totalPrice += item.qty * item.price;
    });

    const payload = {
      transactionId: "TXN-" + Date.now(),
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price,
      })),
      totalItems,
      totalPrice,
      customer: document.querySelector(".customer-info input:nth-child(2)").value || "Walk-in",
      paymentStatus: "Paid",
    };

    try {
      completeBtn.disabled = true;
      completeBtn.textContent = "Processing...";

      const res = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(data);

      completeBtn.disabled = false;
      completeBtn.textContent = "Complete Purchase";

      if (!res.ok) return alert("Error: " + data.message);

      alert("Purchase completed!");

      cart = [];
      renderTable();
    } catch (err) {
      console.error(err);
      completeBtn.disabled = false;
      completeBtn.textContent = "Complete Purchase";
      alert("Server error while completing purchase.");
    }
  });
});
