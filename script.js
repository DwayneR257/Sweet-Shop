let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedCategory = "All";

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCart = document.getElementById("clearCart");
const checkoutBtn = document.getElementById("checkoutBtn");

const productGrid = document.getElementById("productGrid");
const searchBox = document.getElementById("searchBox");
const categoryButtons = document.querySelectorAll(".category-btn");


// LOAD PRODUCTS

function displayProducts(productList){

    productGrid.innerHTML = "";

    productList.forEach(product => {

        productGrid.innerHTML += `
        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.description}</p>

            <span>R${product.price}</span>

            <button class="add-to-cart" data-id="${product.id}">
                Add to Cart
            </button>

        </div>
        `;

    });

    addCartButtons();

}



// ADD TO CART BUTTONS

function addCartButtons(){

    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(button => {

        button.onclick = function(){

            let id = Number(this.dataset.id);

            addToCart(id);

        };

    });

}



// ADD PRODUCT

function addToCart(id){

    let product = products.find(
        product => product.id === id
    );


    if(product){

        cart.push(product);

        updateCart();

    }

}



// UPDATE CART

function updateCart(){

    cartItems.innerHTML = "";

    let total = 0;


    let grouped = {};


    cart.forEach(item => {


        if(grouped[item.id]){

            grouped[item.id].quantity++;

        }
        else{

            grouped[item.id] = {
                ...item,
                quantity:1
            };

        }


    });



    Object.values(grouped).forEach(item=>{


        total += item.price * item.quantity;



        cartItems.innerHTML += `

        <div class="cart-item">

            <div>

                <strong>${item.name}</strong>


                <div class="quantity-controls">

                    <button class="minus"
                    data-id="${item.id}">
                    -
                    </button>


                    ${item.quantity}


                    <button class="plus"
                    data-id="${item.id}">
                    +
                    </button>

                </div>


                <button class="remove-btn"
                data-id="${item.id}">
                Remove
                </button>

            </div>


            <div>
            R${item.price * item.quantity}
            </div>


        </div>

        `;


    });


    cartTotal.innerText =
    "Total: R" + total;


    cartBtn.innerText =
    "🛒 Cart (" + cart.length + ")";


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    cartControls();

}



// CART BUTTON CONTROLS

function cartControls(){


document.querySelectorAll(".plus")
.forEach(button=>{

    button.onclick=function(){

        addToCart(Number(this.dataset.id));

    };

});



document.querySelectorAll(".minus")
.forEach(button=>{


    button.onclick=function(){

        removeOne(Number(this.dataset.id));

    };


});



document.querySelectorAll(".remove-btn")
.forEach(button=>{


    button.onclick=function(){

        removeAll(Number(this.dataset.id));

    };


});


}



// REMOVE ONE

function removeOne(id){

    let index = cart.findIndex(
        item=>item.id===id
    );


    if(index !== -1){

        cart.splice(index,1);

        updateCart();

    }

}



// REMOVE ALL

function removeAll(id){

    cart = cart.filter(
        item=>item.id !== id
    );


    updateCart();

}



// SEARCH

searchBox.addEventListener("input",()=>{

    filterProducts();

});




// CATEGORY BUTTONS

categoryButtons.forEach(button=>{


button.onclick=function(){


    categoryButtons.forEach(btn=>{
        btn.classList.remove("active");
    });


    this.classList.add("active");


    selectedCategory =
    this.dataset.category;


    filterProducts();


};


});




// FILTER

function filterProducts(){


let filtered = products;



if(selectedCategory !== "All"){


    filtered =
    filtered.filter(product =>
        product.category === selectedCategory
    );


}



let search =
searchBox.value.toLowerCase();



if(search){


    filtered =
    filtered.filter(product =>

    product.name.toLowerCase()
    .includes(search)

    );

}



displayProducts(filtered);


}



// OPEN CART

cartBtn.onclick=function(e){

    e.preventDefault();

    cartPanel.classList.add("active");

};



// CLOSE CART

closeCart.onclick=function(){

    cartPanel.classList.remove("active");

};



// CLEAR CART

clearCart.onclick=function(){

    cart=[];

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";

    updateCart();

};



// WHATSAPP CHECKOUT

checkoutBtn.onclick = function(){

    if(cart.length === 0){

        alert("Your cart is empty");
        return;

    }


    let name = document.getElementById("customerName").value;
    let phone = document.getElementById("customerPhone").value;
    let address = document.getElementById("customerAddress").value;


    if(name === "" || phone === "" || address === ""){

        alert("Please enter your name, phone number and address");
        return;

    }


    let message =
`Hello F&D Sweets!

Customer: ${name}
Phone: ${phone}
Address: ${address}

Order:
`;


    let grouped = {};
    let total = 0;


    cart.forEach(item => {

        if(grouped[item.id]){

            grouped[item.id].quantity++;

        }else{

            grouped[item.id] = {
                ...item,
                quantity:1
            };

        }

    });



    Object.values(grouped).forEach(item=>{

        message +=
        `• ${item.name} x${item.quantity} - R${item.price * item.quantity}\n`;

        total += item.price * item.quantity;

    });



    message +=
`
Total: R${total}`;



    let encodedMessage =
    encodeURIComponent(message);


    let whatsappNumber =
    "27711393364";


    window.open(
        `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
        "_blank"
    );

};
// START WEBSITE

displayProducts(products);

updateCart();