
// ================= CART SYSTEM =================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const productGrid = document.getElementById("productGrid");
const searchBox = document.getElementById("searchBox");
const categoryButtons = document.querySelectorAll(".category-btn");
const checkoutBtn = document.getElementById("checkoutBtn");

let selectedCategory = "All";

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

                <strong>${item.name}</strong>

                <div class="quantity-controls">

                    <button
                        class="decrease-btn"
                        data-id="${item.id}">
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        class="increase-btn"
                        data-id="${item.id}">
                        +
                    </button>

                </div>

                <button
                    class="remove-btn"
                    data-id="${item.id}">
                    🗑️ Remove
                </button>

            </div>

            <div>

                R${item.price * item.quantity}

            </div>

        </div>

    `;

    });

    function setupCartControls() {

    document
        .querySelectorAll(".increase-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id =
                    Number(button.dataset.id);

                addToCart(id);

            });

        });

    document
        .querySelectorAll(".decrease-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id =
                    Number(button.dataset.id);

                removeOne(id);

            });

        });

    document
        .querySelectorAll(".remove-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                const id =
                    Number(button.dataset.id);

                removeAll(id);

            });

        });

    }

    function removeOne(id) {

    const index =
        cart.findIndex(item =>
            item.id === id
        );

    if (index !== -1) {

        cart.splice(index, 1);

        updateCart();

    }

    }

    function removeAll(id) {

    cart =
        cart.filter(item =>
            item.id !== id
        );

    updateCart();

    }

    categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedCategory =
            button.dataset.category;

        filterProducts();

    });

    });

    searchBox.addEventListener("input", () => {

        filterProducts();

    });

    checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    let message =
        "Hello F&D Sweets!%0A%0AI'd like to order:%0A%0A";

    const grouped = {};

    cart.forEach(item => {

        if (grouped[item.id]) {

            grouped[item.id].quantity++;

        } else {

            grouped[item.id] = {

                ...item,
                quantity: 1

            };

        }

    });

    let total = 0;

    Object.values(grouped).forEach(item => {

        message +=
            `• ${item.name} x${item.quantity}%0A`;

        total +=
            item.price * item.quantity;

    });

    message +=
        `%0AOrder Total: R${total}`;

    const phone =
        "27721393364";

    window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
    );

    });

    cartTotal.innerText = `Total: R${total}`;

    cartBtn.innerText = `🛒 Cart (${cart.length})`;

    localStorage.setItem("cart", JSON.stringify(cart));

    setupCartControls();

}