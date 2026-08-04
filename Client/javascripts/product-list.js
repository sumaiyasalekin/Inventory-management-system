document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("tbody");
  const searchInput = document.querySelector(".search-bar input");

  async function loadProducts(query = "") {
    try {
      let url = "http://localhost:5000/products";

      if (query.trim() !== "") {
        url += `?search=${query}`;
      }

      const res = await fetch(url);
      const products = await res.json();

      tableBody.innerHTML = "";

      products.forEach((product) => {
        const tr = document.createElement("tr");
        console.log(product);

        tr.innerHTML = `
                    <td>${product._id}</td>
                    <td><img src="${product.imageLink}" class="product-img"></td>
                    <td>${product.name}</td>
                    <td>$${product.price}</td>
                    <td>${product.stock}</td>
                    <td>${product.category}</td>
                    <td>
                        <button class="button button-secondary" onclick="deleteProduct('${product._id}')">Delete</button>
                    </td>
                `;

        tableBody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error loading products:", error);
      tableBody.innerHTML = `<tr><td colspan="7">Failed to load products</td></tr>`;
    }
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim();
    loadProducts(query);
  });

  loadProducts();
});

async function deleteProduct(id) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Error deleting product: " + data.message);
      return;
    }

    alert("Product deleted successfully!");
    location.reload();
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Server error");
  }
}
