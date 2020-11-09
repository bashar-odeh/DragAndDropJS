// vars ..
const items = document.querySelector(".items");
const random = document.querySelector("[category=random]");
const men = document.querySelector("[category=men]");
const women = document.querySelector("[category=women]");
const accessories = document.querySelector("[category=Accessories]");
const electronics = document.querySelector("[category=Electronics]");
const cart = document.querySelector(".cart-products");
const theme = document.querySelector(".icons .theme");
console.log(theme.innerText)
    // event listners 
cart.addEventListener("dragover", (e) => {
    e.preventDefault();
})
cart.addEventListener("drop", (e) => {

    e.preventDefault();

    var data = e.dataTransfer.getData("text");
    let div = document.getElementById(data);
    itemExisitance(data, div, cart);

});
theme.addEventListener("click", changeMode);


//functions 
function changeMode(e) {
    currentTheme = e.target.innerText.toLowerCase();

    switch (currentTheme) {
        case "night":
            {
                console.log("hi day");
                document.querySelector(".container").classList.add("nightMode");
                document.querySelector("body").classList.add("nightMode");
                document.querySelector(".items").classList.add("nightMode");
                document.querySelector("h3").classList.add("nightMode");
                document.querySelectorAll(".cart-item").forEach((item) => { item.classList.add("nightMode"); });
                e.target.innerText = "Day";
                e.target.classList.add("fa-sun");
                e.target.classList.remove("fa-moon");

                break;
            }
        case "day":
            {
                console.log("hi night");
                document.querySelector(".container").classList.remove("nightMode");
                document.querySelector("body").classList.remove("nightMode");
                document.querySelector(".items").classList.remove("nightMode");
                document.querySelector("h3").classList.remove("nightMode");
                document.querySelectorAll(".cart-item").forEach((item) => { item.classList.remove("nightMode"); })
                e.target.innerText = "Night";
                e.target.classList.remove("fa-sun");
                e.target.classList.add("fa-moon");

                break;
            }

    }

}


function Search(data) {
    const cartItems = document.querySelectorAll(".cart-item");

    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id === data) {
            return [true, cartItems[i]];
        }
    }
    return [false];
}

function itemExisitance(id, div, e) {

    let len = cart.querySelectorAll(".cart-item").length;
    if (len > 0) {
        let temp = Search(id);
        if (temp[0]) {

            temp[1].childNodes[4].innerText++;
            updatePrice();
        } else {
            createCardProducts(id, div.childNodes, e);
            updatePrice();
        }

    } else {
        createCardProducts(id, div.childNodes, e);
        updatePrice();
    }



};

function updatePrice() {
    sum = 0;

    const math = document.querySelector(".cart-price");
    math.innerText = "";

    const allCart = document.querySelectorAll(".cart-item");
    allCart.forEach(item => {

        sum += (parseFloat(item.childNodes[3].innerText) * parseFloat(item.childNodes[4].innerText));
    });

    math.innerText = sum.toFixed(2) + " $";
    let tax = document.querySelector(".cart-taxes-in");
    tax.innerText = Math.round(sum * 0.2);
    let tempTax = parseFloat(tax.innerText);
    tax.innerText = (sum * 0.2).toFixed(2) + " $";

    document.querySelector(".cart-sum").innerText = (sum + tempTax).toFixed(2);


}


function deleteElementFromCart(e) {

    let target = e.target.parentElement;
    parent = e.target.parentElement.parentElement;
    if (target.childNodes[4].innerText > 1) {
        target.childNodes[4].innerText--;
    } else {
        parent.removeChild(target);
    }

    updatePrice();

}

function plusOne(e) {
    e.target.innerText++;
    updatePrice();
}

function createCardProducts(data, elements, target) {
    let div = document.createElement("div");
    div.classList.add("cart-item");
    div.setAttribute("id", data)
    div.setAttribute("draggable", false);

    let button = document.createElement("button");
    button.innerText = "X";
    button.addEventListener("click", deleteElementFromCart)
    div.append(button);
    let img = document.createElement("img");
    img.src = elements[0].src;
    div.append(img);
    let name = document.createElement("span");
    name.classList.add("cart-item-name");
    name.innerText = elements[1].innerText.substring(0, 30) + "...";
    div.append(name);
    let price = document.createElement("span");
    price.classList.add("cart-item-price");
    price.innerText = elements[2].innerText;
    div.append(price);
    let repeted = document.createElement("var");
    repeted.classList.add("repeted");
    repeted.innerText = 1;
    repeted.addEventListener("click", plusOne)
    div.append(repeted);
    target.append(div);

    if (theme.innerText === "Day") {
        div.classList.add("nightMode");
    }


}

function getProducts(s) {
    //empty the items and then add the wished items .. 

    items.innerHTML = "";
    fetch('https://fakestoreapi.com/products/' + s)
        .then(res => res.json())
        .then(json => {
            json.forEach(product => {
                creatCard(product);

            });

        });

};



function drag(e) {
    e.dataTransfer.setData("text", e.target.id);


}


function creatCard(product) {
    // creating div item
    const div = document.createElement("div");
    div.classList.add("item");

    //Adding attributes to help filiiring 
    div.setAttribute("draggable", true);
    //Adding drag event
    div.addEventListener("dragstart", drag)
    div.setAttribute("id", product.id);
    div.setAttribute("category", product.category);
    //adding image from src 
    const img = document.createElement("img");
    img.src = product.image;
    img.setAttribute("draggable", false)

    // adding span name ..
    const span = document.createElement("span");
    span.innerText = product.title.substring(0, 60) + "...";
    span.classList.add("item-name");
    span.setAttribute("id", product.id);
    const price = document.createElement("span");
    price.classList.add("price");
    price.innerText = product.price + "$";
    price.setAttribute("id", product.id);
    const p = document.createElement("p");
    p.classList.add("item-description");
    p.innerText = product.description.substring(0, 150);
    p.setAttribute("id", product.id);
    div.append(img);
    div.append(span);
    div.append(price)
    div.append(p);
    items.append(div);
    readMorReadLess(div);
}
// random.addEventListener("click", () => { getProducts("") });
// men.addEventListener("click", () => { getProducts("/category/men clothing") });
// women.addEventListener("click", () => { getProducts("/category/women clothing") });
// accessories.addEventListener("click", () => { getProducts("/category/jewelery") });
// electronics.addEventListener("click", () => { getProducts("/category/electronics") });

function filter() {

    let categories = document.querySelectorAll("[category]");
    categories.forEach(category => {
        category.addEventListener("click", (e) => {
            switch (e.target.getAttribute("category")) {
                case "random":
                    {
                        getProducts("");

                        break;
                    }

                case "men":
                    {
                        getProducts("/category/men clothing");

                        break;
                    }

                case "women":
                    {
                        getProducts("/category/women clothing");

                        break;
                    }

                case "Accessories":
                    { getProducts("/category/jewelery"); break; }

                case "Electronics":
                    { getProducts("/category/electronics"); break; }

                default:
                    { getProducts("") }
            }

        });

    });


}


function readMorReadLess(item) {
    const item_description = item.querySelector(".item-description");

    if (item_description.innerText.length > 75) {
        var originalText = item_description.innerText;
        var sub = item_description.innerText.substring(0, 70);
        item_description.innerText = sub + "...";
        var button = document.createElement("button");
        button.innerText = "Read More .."
        button.classList.add("read-more");
        item.append(button)
        var isOpen = false;
        button.addEventListener("click", () => {
            if (isOpen) {
                item.style.height = "360px";
                item_description.innerText = sub + "...";
                button.innerText = "Read More ..."
                isOpen = false;
            } else {
                item.style.height = "400px";
                item_description.innerText = originalText;
                button.innerText = "Read Less"
                isOpen = true;
            }

        })

    }

};
//calls 
getProducts("");
filter();