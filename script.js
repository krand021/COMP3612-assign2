const VIEWIDS = ["homeview", "categoryview", "browseview", "productview", "cartview"];
const FEATURED_IDS = [99,80,95,42];

import data from './data/data-minifed.json' with { type: 'json' };

document.addEventListener('DOMContentLoaded', () =>{
    //start in home view
    viewChanger("homeview");
    const body = document.querySelector("body");
    body.addEventListener("click", handleNavClick);
    showFeaturedProducts(data.products);
});



// event delegation! one listener on body handles every click
function handleNavClick(e) {
    // Element.closest(): https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    const clickedCard = e.target.closest(".product-card");
    const clickedLink = e.target.closest("[data-view]");

    if (clickedCard !== null) {
        e.preventDefault();
        ClickedCard(clickedCard);
    } else if (clickedLink !== null) {
        e.preventDefault();
        ClickedLink(clickedLink);
    }
}

// product card clicked, show its single product view
function ClickedCard(card) {
    const cardID = Number(card.dataset.productId);
    const productClicked = data.products.find(product => product.id === cardID);
    //first populate the page
    showProduct(productClicked);
    //then swap to it
    viewChanger("productview");
}



function showProduct(product){
    document.querySelector("#crumbCategory").textContent = product.category;

}








// nav link clicked, show that view or the about popup
function ClickedLink(link) {
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

    // highest rated first, then keep the top 4
    // look up each featured id in the product list
    // went through the data and found the highest rated products ids
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
