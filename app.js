var cartBtn = document.querySelector('.cart-btn');
var closeCartBtn = document.querySelector('.close-cart');
var clearCart = document.querySelector('.clear-cart');
var cartDOM = document.querySelector('.cart');
var cartOverlay = document.querySelector('.cart-overlay');
var cartItems = document.querySelector('.cart-items');
var cartTotal = document.querySelector('.cart-total');
var cartContent = document.querySelector('.cart-content');
var productsDOM = document.querySelector('.products-center');

//cart
let cart = [];
let buttonsDOM = [];
//getting products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json');
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                console.log({ title, price, id, image });
                return { title, price, id, image };

            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }


}

//display products

class UI {

    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fa fa-shopping-cart"></i> add to bag
                        </button>
                </div>

                <h3>${product.title}</h3>
                <h4>${product.price}</h4>

            </article>
            `;
        });
        productsDOM.innerHTML = result;
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        //console.log(buttons);
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;

            } else {
                button.addEventListener('click', (event) => {
                    event.target.innerText = "In Cart";
                    //GET PRODUCSTSfrom products
                    //using spread operator ...
                    let cartItem = {...Storage.getProduct(id), amount: 1 };
                    //add product to cart
                    cart.push(cartItem);
                    console.log(cart);
                    //save cart in local storage
                    //refreshing the window will save cart items
                    Storage.saveCart(cart);
                    //set cart values
                    this.setCartValues(cart);

                    //display cart item
                    this.addCartItem(cartItem);
                    //show cart
                    event.target.disabled = true;

                });
            }



        });
    }

    setCartValues(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }

    addCartItem(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fa fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount} </p>
                        <i class="fa fa-chevron-down" data-id=${item.id}></i>
                    </div>
        `;
        cartContent.appendChild(div);

    }

}

//local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));

    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(p => p.id === id);
    }

    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));

    }

}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();

    //get all products
    products.getProducts().then(products => {
        console.log(products);
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    });


});