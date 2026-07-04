
// ================= CART SYSTEM =================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const productGrid = document.getElementById("productGrid");
const productGrid = document.getElementById("productGrid");
const searchBox = document.getElementById("searchBox");

function displayProducts(list = products) {

    productGrid.innerHTML = "";

    list.forEach(product => {

        productGrid.innerHTML += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <span>R${product.price}</span>

            <button
                class="add-to-cart"
                data-id="${product.id}">
                Add to Cart
            </button>

        </div>

        `;

    });

    setupCartButtons();

}

searchBox.addEventListener("input", () => {

    const search = searchBox.value.toLowerCase();

    const filtered = products.filter(product => {

        return product.name.toLowerCase().includes(search) ||
               product.description.toLowerCase().includes(search);

    });

    displayProducts(filtered);

});

function setupCartButtons() {

    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const id = Number(button.dataset.id);

            addToCart(id);

        });

    });

}

function addToCart(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    cart.push(product);

    updateCart();

}

// Open cart
cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartPanel.classList.add("active");
});

// Close cart
closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("active");
});

// Add to cart buttons
document.querySelectorAll(".add-to-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.getAttribute("data-name");
        const price = Number(button.getAttribute("data-price"));

        cart.push({ name, price });

        updateCart();

        button.innerText = "Added ✔";
        button.style.background = "#28a745";

        setTimeout(() => {
            button.innerText = "Add to Cart";
            button.style.background = "#ff4d88";
        }, 1000);

    });

    clearCart.addEventListener("click", () => {

        cart = [];

        updateCart();

    });

});

// Update cart UI
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;

    const grouped = {};

    cart.forEach(item => {

        total += item.price;

        if (grouped[item.id]) {

            grouped[item.id].quantity++;

        } else {

            grouped[item.id] = {

                ...item,

                quantity: 1

            };

        }

    });

    Object.values(grouped).forEach(item => {

        cartItems.innerHTML += `

            <div class="cart-item">

                <div>

                    <strong>${item.name}</strong><br>

                    Qty: ${item.quantity}

                </div>

                <div>

                    R${item.price * item.quantity}

                </div>

            </div>

        `;

    });

    cartTotal.innerText = `Total: R${total}`;

    cartBtn.innerText = `🛒 Cart (${cart.length})`;

    localStorage.setItem("cart", JSON.stringify(cart));

}