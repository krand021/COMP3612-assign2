const VIEWIDS = ["homeview", "categoryview", "browseview", "productview", "cartview"];


document.addEventListener('DOMContentLoaded', () =>{
    //start in home view
    viewChanger("homeview");
    const header = document.querySelector("header");
    header.addEventListener("click", handleNavClick);




// event delegation! only one event listener
function handleNavClick(e) {
    // find the link that was clicked 
    const clickedLink = e.target.closest("[data-view]");

    // Ignore clicks that weren't on a nav link
    if (clickedLink === null) {
        return;
    }

    // stop the "#" link from jumping to the top of the page
    e.preventDefault();

    const viewName = clickedLink.dataset.view;

    // about is a popup, not a view, so we gotta treat it differently
    if (viewName === "aboutdialog") {
        const aboutDialog = document.querySelector("#aboutdialog");
        aboutDialog.showModal();
    } else {
        viewChanger(viewName);
    }
}





    function viewChanger(viewId) {
        const keep = VIEWIDS.find(view => view === viewId);
        for (const view of VIEWIDS) {
            if (view === keep) {
                document.querySelector(`#${view}`).classList.toggle('hidden', false);
            } else {
                document.querySelector(`#${view}`).classList.toggle('hidden', true);
            }
        }
    }
});