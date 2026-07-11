let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedCategory = "All";


// ELEMENTS

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



// CHECK PRODUCTS

if(typeof products === "undefined"){

    console.error(
        "Products array not found. Load products.js before this file."
    );

}



// DISPLAY PRODUCTS

function displayProducts(productList){

    if(!productGrid) return;


    productGrid.innerHTML = "";


    if(productList.length === 0){

        productGrid.innerHTML = `
        <p class="no-products">
        No products found 🍬
        </p>
        `;

        return;

    }



    productList.forEach(product => {


        productGrid.innerHTML += `

        <div class="product-card">


            <img src="${product.image}" 
            alt="${product.name}">


            <h3>${product.name}</h3>


            <p>${product.description}</p>


            <span>
            R${product.price}
            </span>


            <button 
            class="add-to-cart"
            data-id="${product.id}">

            Add to Cart

            </button>


        </div>

        `;


    });


    addCartButtons();

}




// ADD CART BUTTONS

function addCartButtons(){


    document.querySelectorAll(".add-to-cart")
    .forEach(button=>{


        button.onclick=function(){


            addToCart(
                Number(this.dataset.id)
            );


        };


    });


}




// ADD TO CART

function addToCart(id){


    if(typeof products === "undefined")
    return;



    let product =
    products.find(product=>product.id === id);



    if(product){


        cart.push(product);


        updateCart();


    }


}




// UPDATE CART

function updateCart(){


    if(!cartItems || !cartTotal)
    return;



    cartItems.innerHTML="";


    let total=0;


    let grouped={};



    cart.forEach(item=>{


        if(grouped[item.id]){


            grouped[item.id].quantity++;


        }
        else{


            grouped[item.id]={

                ...item,

                quantity:1

            };


        }


    });



    if(cart.length===0){


        cartItems.innerHTML=`

        <p class="empty-cart">

        🍬 Your cart is empty.<br>
        Start adding delicious sweets!

        </p>

        `;


    }




    Object.values(grouped)
    .forEach(item=>{


        total +=
        item.price * item.quantity;



        cartItems.innerHTML += `


        <div class="cart-item">


        <div>


        <strong>
        ${item.name}
        </strong>



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



        <button 
        class="remove-btn"
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



    if(cartBtn){

        cartBtn.innerText =
        "🛒 Cart (" + cart.length + ")";

    }



    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );



    cartControls();


}




// CART CONTROLS

function cartControls(){



    document.querySelectorAll(".plus")
    .forEach(button=>{


        button.onclick=function(){

            addToCart(
                Number(this.dataset.id)
            );

        };


    });





    document.querySelectorAll(".minus")
    .forEach(button=>{


        button.onclick=function(){

            removeOne(
                Number(this.dataset.id)
            );

        };


    });





    document.querySelectorAll(".remove-btn")
    .forEach(button=>{


        button.onclick=function(){


            removeAll(
                Number(this.dataset.id)
            );


        };


    });



}




// REMOVE ONE

function removeOne(id){


    let index =
    cart.findIndex(
        item=>item.id===id
    );



    if(index !== -1){


        cart.splice(index,1);


        updateCart();


    }


}




// REMOVE ALL

function removeAll(id){


    cart =
    cart.filter(
        item=>item.id!==id
    );



    updateCart();


}





// SEARCH

if(searchBox){


searchBox.addEventListener(
"input",
()=>{

    filterProducts();

});


}




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





// FILTER PRODUCTS

function filterProducts(){


    if(typeof products==="undefined")
    return;



    let filtered =
    products;



    if(selectedCategory!=="All"){


        filtered =
        filtered.filter(product=>

        product.category === selectedCategory

        );


    }




    if(searchBox){


        let search =
        searchBox.value
        .toLowerCase();



        if(search){


            filtered =
            filtered.filter(product=>


            product.name
            .toLowerCase()
            .includes(search)

            ||

            product.description
            .toLowerCase()
            .includes(search)


            );


        }


    }




    displayProducts(filtered);


}





// OPEN CART

if(cartBtn){

cartBtn.onclick=function(e){

    e.preventDefault();


    if(cartPanel){

        cartPanel.classList.add("active");

    }

};


}





// CLOSE CART

if(closeCart){

closeCart.onclick=function(){


    cartPanel.classList.remove("active");


};


}




// CLEAR CART

if(clearCart){


clearCart.onclick=function(){


    cart=[];


    const fields=[

    "customerName",
    "customerPhone",
    "customerAddress"

    ];



    fields.forEach(id=>{


        let field =
        document.getElementById(id);



        if(field){

            field.value="";

        }


    });



    updateCart();


};


}




// WHATSAPP CHECKOUT

if(checkoutBtn){


checkoutBtn.onclick=function(){



    if(cart.length===0){


        alert(
        "Your cart is empty"
        );

        return;


    }





    let name =
    document.getElementById("customerName")?.value;



    let phone =
    document.getElementById("customerPhone")?.value;



    let address =
    document.getElementById("customerAddress")?.value;




    if(
    !name ||
    !phone ||
    !address
    ){


        alert(
        "Please fill in all details"
        );


        return;


    }




    if(!/^[0-9]{10}$/.test(phone)){


        alert(
        "Enter a valid 10 digit phone number"
        );


        return;


    }





    let message =
`Hello F&D Sweets!

Customer: ${name}
Phone: ${phone}
Address: ${address}

Order:
`;



    let grouped={};

    let total=0;




    cart.forEach(item=>{


        if(grouped[item.id]){


            grouped[item.id].quantity++;


        }
        else{


            grouped[item.id]={

            ...item,

            quantity:1

            };


        }


    });





    Object.values(grouped)
    .forEach(item=>{


        message +=

`• ${item.name} x${item.quantity} - R${item.price * item.quantity}
`;


        total +=
        item.price *
        item.quantity;


    });




    message +=
`

Total: R${total}`;



    let whatsappNumber =
    "27721393364";



    window.open(

    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,

    "_blank"

    );



};


}






// LOADER

window.addEventListener(
"load",
()=>{


const loader =
document.getElementById("loader");



if(loader){


setTimeout(()=>{


loader.style.opacity="0";



setTimeout(()=>{


loader.style.display="none";
},500);
},1000);
}
});

// START WEBSITE

if(typeof products!=="undefined"){
    displayProducts(products);
}
updateCart();