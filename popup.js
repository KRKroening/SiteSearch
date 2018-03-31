// let changeColor = document.getElementById('changeColor');

// chrome.storage.sync.get('color', function(data) {
// changeColor.style.backgroundColor = data.color;
// changeColor.setAttribute('value', data.color);
// });

// changeColor.onclick = function(element) {
//     let color = element.target.value;
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '";'});
//   };


/* 
TODO:
Store sites
pull sites from store and dyn create list
add scroll to list div
style?
Icons
Settings page
*/
function load(){
    let searchButton = document.getElementById("searchButton")
    const google = "https://www.google.ca/search?q="

    searchButton.addEventListener('click', function(){
        let searchString = document.getElementById("searchText")
        searchString = searchString.value
        let selectedParent = findSelectedParent()
        let selectedChild = findSelectedChild()

        let locationString = google + searchString+"+site:" + selectedParent + "/" + selectedChild
        window.open(locationString)
        //console.log(google + searchString+"+site:" + selectedParent + "/" + selectedChild)
    })

    function findSelectedParent(){
        let parents = document.getElementsByName("parentRadios")
        let selected
        parents.forEach(function(p) {
            if(p.checked == true){
                selected = p.dataset.url
            }
        }, this);
        return selected
    }

    function findSelectedChild(){
        let childs = document.getElementsByName("childRadios")
        let selected
        childs.forEach(function(c) {
            if(c.checked == true){
                selected = c.dataset.url
            }
        }, this); 
        return selected
    }
}

document.addEventListener("DOMContentLoaded", function(){
    load()
})