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
        console.log(buttons);
        buttons.forEach(button => {
            let id = button.id;

        });
    }
}

//local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));

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