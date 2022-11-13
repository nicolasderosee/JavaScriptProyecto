const listOfProducts = "../json/products.json";
const Products = [];
const containerProducts = document.getElementById("containterProducts");

fetch(listOfProducts)
    .then((response) => response.json())
    .then((data) => {
        data.forEach((p) => {
            Products.push(p);
        });
    })
    .catch((error) => console.log(error))
    .finally(() => showProducts())


    //cargar carrito desde el localStorage
let cart = [];
if(localStorage.getItem("cart")) { //si hay algo en el localStorage, se carga en el carrito
    cart = JSON.parse(localStorage.getItem("cart"));
}

//función para mostrar los productos
const showProducts = () => {
    Products.forEach((p) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3","col-md-6","col-xs-12","mb-3");
        card.innerHTML = `
            <div class="card">
                <img src="${p.img}" class="card-img-top imgProducts" alt="${p.name}">
                <div class="card-body">
                    <h5 class="card-title"> ${p.name}</h5>
                    <p class="card-text">$${p.price}</p>
                    <button class="btn btnColor" id="boton${p.id}">Add to cart <i class="bi bi-cart4"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-cart4 mb-1" viewBox="0 0 16 16">
                    <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l.5 2H5V5H3.14zM6 5v2h2V5H6zm3 0v2h2V5H9zm3 0v2h1.36l.5-2H12zm1.11 3H12v2h.61l.5-2zM11 8H9v2h2V8zM8 8H6v2h2V8zM5 8H3.89l.5 2H5V8zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                    </svg></i></button>
                </div>
            </div>    
        `
        containerProducts.appendChild(card);

        //Agrego productos al carrito
        const boton = document.getElementById(`boton${p.id}`);
        boton.addEventListener("click", () => {
            addToCart(p.id);
            Toastify({
                text:"Added to cart",
                duration:3000,
                gravity:"bottom",
                position:"left",
            }).showToast();
        })
    })
}

//función para agregar al carrito, revisa si el producto ya está o no en el carrito
const addToCart = (id) => {
    const product = Products.find((p) => p.id === id);
    const productInCart = cart.find((p) => p.id === id);
    if(productInCart){ //si está, aumenta la cantidad en 1
        productInCart.quantity++;
    }else { //si no está lo agrega al carrito
        cart.push(product);
        //Uso localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    totalCalculate();
}

//mostrar el carrito de compras
const viewCart = document.getElementById("viewCart");
const cartContainer = document.querySelector('.cartContainer')

viewCart.addEventListener("click", () => {
    showCart();
});

//función para mostrar el carrito
const showCart = () => {
    cartContainer.innerHTML="";
    cart.forEach((p) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-6","col-md-6","col-xs-12");
        card.innerHTML = `
            <div class="modal-container"</div>
            <div class="card">
                <img src="${p.img}" class="card-img-top imgProducts" alt="${p.name}">
                <div class="card-body">
                <h5 class="card-title"> ${p.name}</h5>
                <p class="card-text"> ${p.price}</p>
                <p class="card-text"> ${p.quantity}</p>
                <button class="btn btnColor" id="delete${p.id}">Delete Product</button>
                </div>
            </div>    
        `
        cartContainer.appendChild(card);
        //eliminar productos del carrito:
        const boton = document.getElementById(`delete${p.id}`);
        boton.addEventListener("click", () => {
            deleteFromCart(p.id);
        })
    })
    totalCalculate();
}

//Función que elimina el producto del carrito
const deleteFromCart = (id) => {
    const product = cart.find((p) => p.id === id);
    const i = cart.indexOf(product);
    product.quantity == 1 ? cart.splice(cart.indexOf(product), 1) : cart[i].quantity = cart[i].quantity - 1;
    showCart();
    //localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
}

//Función que vacía todo el carrito
const clearCart = document.getElementById("clearCart");
//clearCart.addEventListener("click", () => {
//    deleteAll();
//})

clearCart.addEventListener("click", () => {
    Swal.fire({
        title: "Are you sure you want to delete all the items?",
        icon: "warning",
        confirmButtonText: "Confirm",
        showCancelButton: "true",
        cancelButtonText: "Cancel",
        cancelButtonColor: "#f04b6e",
        confirmButtonColor: "#f04b6e"   
    }).then((result)=> {
        if(result.isConfirmed){
            deleteAll();
            Swal.fire({
                title:"Deleted from cart",
                icon:"Succes",
                confirmButtonText:"Confirm",
                confirmButtonColor: "#f04b6e"   
            })
        }
    })
})


//Función para eliminar todo el carrito
const deleteAll = () => {
    cart = [];
    showCart();
    //localStorage
    localStorage.clear();
}

//Mostramos mensaje con el total de la compra
const total = document.getElementById("total");
const totalCalculate = () => {
    let totalPurchase = 0;
    cart.forEach((p) => {
        totalPurchase += p.price * p.quantity;
    })
    total.innerHTML = ` $${totalPurchase}`;
}

setTimeout(() =>{
    Swal.fire({
        title: 'Subscribe to our newsletter for secret recipes and 10% of your first order!',
        color:'#ffffff',
        imageUrl: 'img/figure-social-dog.webp',
        imageWidth: 250,
        imageHeight: 200,
        imageAlt: 'chamberlain dog',
        background: '#f04b6e',
        confirmButtonText: "Suscribe",
        confirmButtonColor: "#1c5e0d",
        showCancelButton: "true",
        cancelButtonColor: "#1c5e0d"
      })
},3000)