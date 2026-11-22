import data from './data/data-minifed.json' with { type: 'json' };


const VIEWIDS = ["homeview", "categoryview", "browseview", "productview", "cartview"];
const FEATURED_IDS = [99,80,95,42];
let cart = loadCart();

document.addEventListener('DOMContentLoaded', () =>{
    //start in home view
    viewChanger("homeview");
    updateCartCount();
    const body = document.querySelector("body");
    body.addEventListener("click", handleNavClick);
    showFeaturedProducts(data.products);
    showCategories(data.products);
});



// event delegation! one listener on body handles every click
function handleNavClick(e) {
    // Element.closest(): https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    const clickedCard = e.target.closest(".product-card");
    const clickedLink = e.target.closest("[data-view]");
    const clickedTab = e.target.closest(["[data-tab]"]);
    const clickedAddToCart = e.target.closest("#addToCart");
    if (clickedCard !== null) {
        e.preventDefault();
        handleClickedCard(clickedCard);
    } else if (clickedLink !== null) {
        e.preventDefault();
        handleClickedLink(clickedLink);
        
    } else if (clickedTab !== null){
        // for specs/review panel in singleproduct page
        handleClickedTab(clickedTab);
    } else if (clickedAddToCart !== null){
        handleAddToCart(clickedAddToCart);
    }

}


function handleAddToCart(clickedAddToCart) {
    const productId = Number(clickedAddToCart.dataset.productId);
    const quantity = Number(document.querySelector("#quantity").value);

    const itemInCart = cart.find(item => item.id === productId);

    if (itemInCart) {
        itemInCart.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity });
    }

    updateCartCount();
    saveCart();

    // look up the product so we can show its name in the toast
    const product = data.products.find(product => product.id === productId);

    // toast pattern from Lab 9b
    showToast(`Added ${quantity} × ${product.title} to cart!`);
}



function showToast(msg){
    const bar = document.querySelector("#toast");
    // used a fade instead of toggle and it looks way better
    // https://tailwindcss.com/docs/animation
    bar.classList.toggle("opacity-0", false);   // fade in
    bar.textContent = msg;
    setTimeout(() => {
        bar.classList.toggle("opacity-0", true);    // fade out    
        },4000);
}


function updateCartCount(){
    let displayedAmt = 0;
    for(const item of cart){
        displayedAmt += item.quantity;
    }
    document.querySelector("#cart-count").textContent = displayedAmt;
}


// load cart from localStorage, or an empty array if nothing saved yet Lab 10
function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// save the current cart array to localStorage, Lab 10
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// handel swapping tabs
function handleClickedTab(clickedTab) {
    const tab = clickedTab.dataset.tab;
    const specs = document.querySelector("#specsPanel");
    const reviews = document.querySelector("#reviewsPanel");

    if (tab === "specsPanel") {
        specs.classList.toggle("hidden", false);
        reviews.classList.toggle("hidden", true);
    } else if (tab === "reviewsPanel") {
        specs.classList.toggle("hidden", true);
        reviews.classList.toggle("hidden", false);
    }
}


// product card clicked, fill the single product view then show it
function handleClickedCard(card) {
    const cardID = Number(card.dataset.productId);
    const productClicked = data.products.find(product => product.id === cardID);
    // fill
    showBreadcrumb(productClicked);
    showProductInfo(productClicked);
    showTags(productClicked);
    showSpecs(productClicked);
    showReviews(productClicked);
    // display
    viewChanger("productview");
}

function showReviews(product){
    const reviews = product.reviews;
    const template = document.querySelector("#reviewTemplate");
    const list = document.querySelector("#reviewList");
    
    list.replaceChildren();

    for(const review of reviews){
        const line = template.content.cloneNode(true);

        line.querySelector(".review-rating").textContent = makeStars(review.rating);
        line.querySelector(".review-comment").textContent = review.comment;
        line.querySelector(".review-name").textContent = review.reviewerName;
           // format the date: toLocaleDateString
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
        line.querySelector(".review-date").textContent = 
                                                        new Date(review.date).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" });
    
        list.appendChild(line);
    }
}



function showBreadcrumb(product) {
    document.querySelector("#crumbCategory").textContent = product.category;
    document.querySelector("#crumbTitle").textContent = product.title;
}



// image, title, price, sku, rating, stock, description
function showProductInfo(product) {
    const img = document.querySelector("#singleProdImage");
    img.setAttribute("src", product.images[0]);
    img.setAttribute("alt", product.title);

    document.querySelector("#productTitle").textContent = product.title;
    document.querySelector("#productPrice").textContent = `$${product.price.toFixed(2)}`;
    document.querySelector("#sku").textContent = `SKU: ${product.sku}`;
    document.querySelector("#ratings").textContent = `${makeStars(product.rating)} (${product.rating})`;
    document.querySelector("#prodDesc").textContent = product.description;

    const stockText = document.querySelector("#stock");
    if (product.stock > 0) {
        stockText.textContent = "In stock";
    } else {
        stockText.textContent = "Out of stock";
    }

    // reset quantity back to 1 for each new product
    document.querySelector("#quantity").value = 1;

    document.querySelector("#addToCart").dataset.productId = product.id;

}




// tags as pills
function showTags(product) {
    const tagsBox = document.querySelector("#tags");
    tagsBox.replaceChildren();

    for (const tag of product.tags) {
        const pill = document.createElement("span");
        pill.textContent = tag;
        pill.classList.add("tag-pill");
        tagsBox.appendChild(pill);
    }
}



// weight, dimensions, warranty, shipping, returns
function showSpecs(product) {
    const dim = product.dimensions;
    document.querySelector("#specWeight").textContent = `${product.weight} kg`;
    document.querySelector("#specDimensions").textContent = `${dim.width} × ${dim.height} × ${dim.depth} cm`;
    document.querySelector("#specWarranty").textContent = product.warrantyInformation;
    document.querySelector("#specShipping").textContent = product.shippingInformation;
    document.querySelector("#specReturns").textContent = product.returnPolicy;
}




// turns a rating like 3.6 into stars
function makeStars(rating) {
    const full = Math.round(rating);
    let stars = "";

    // add the filled stars
    for (let i = 0; i < full; i++) {
        stars += "★";
    }
    // fill the rest of the 5 with empty stars
    for (let i = full; i < 5; i++) {
        stars += "☆";
    }

    return stars;
}





// nav link clicked, show that view or the about popup
function handleClickedLink(link) {
    const viewName = link.dataset.view;

    // about is a popup, not a view, so we gotta treat it differently
    if (viewName === "aboutdialog") {
        document.querySelector("#aboutdialog").showModal();
    } else {
        viewChanger(viewName);
    }
}




function showFeaturedProducts(products) {
    const template = document.querySelector("#productCardTemplate");
    const parent = document.querySelector("#featuredProducts");

    // shows the four highest rated products
    // look up each featured id in the product list
    // went through the data and found the highest rated products ids
    // stored as an const array called FEATURED_IDS
    const featured = FEATURED_IDS.map(id => products.find(p => p.id === id));


    for (const product of featured) {
        const card = template.content.cloneNode(true);

        const img = card.querySelector("img");
        img.setAttribute("src", product.thumbnail);
        img.setAttribute("alt", product.title);

        card.querySelector(".card-category").textContent = product.category;
        card.querySelector(".card-title").textContent = product.title;
        card.querySelector(".card-price").textContent = `$${product.price.toFixed(2)}`;

        // store the id so a click can open the rightProduct view later
        card.querySelector(".product-card").dataset.productId = product.id;

        parent.appendChild(card);
    }
}


function viewChanger(viewId) {
    const keep = VIEWIDS.find(view => view === viewId);
    for (const view of VIEWIDS) {
        if (view === keep) {
            // classList.toggle: https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle
            document.querySelector(`#${view}`).classList.toggle('hidden', false);
        } else {
            document.querySelector(`#${view}`).classList.toggle('hidden', true);
        }
    }
}

function showCategories(products) {
    const template = document.querySelector("#categoryCardTemplate");
    const parent = document.querySelector("#categoryGrid");

    const categories = new Set();

    // find all categories
    for (const product of products) {
        categories.add(product.category);
    }

    // create card for each category
    for (const category of categories) {

        // find a product in this category for its thumbnail
        const product = products.find(p => p.category === category);

        const card = template.content.cloneNode(true);

        const img = card.querySelector("img");
        img.setAttribute("src", product.thumbnail);
        img.setAttribute("alt", category);
        card.querySelector(".category-name").textContent = category;
        card.querySelector("a").dataset.category = category;

        parent.appendChild(card);
    }
}
