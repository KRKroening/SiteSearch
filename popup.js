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


function loadSavedSites(){
    let parentList = document.querySelector(".parentList")

    chrome.storage.sync.get("Sites", function (result) {
        storageSite = result["Sites"]        

        let siteSection = `<li><input type="radio" name="parentRadios" data-url="{0}">{1}`;
        let subsiteSelection =  `
            <li><input type="radio" name="childRadios" data-url="{0}">{1}
            </li>`;
        if(storageSite.length > 0){
            storageSite.forEach(function(s){
                let toAppend = "";
                toAppend += siteSection.format(s["siteUrl"], s["siteName"])
                if(s["subsites"].length > 0){
                    toAppend += "<ul>"
                    s["subsites"].forEach(function(s){
                        toAppend+= subsiteSelection.format(s["subsiteUrl"],s["subsiteName"])
                    })
                    toAppend += "</ul>"
                }
                toAppend+= "</li>"
                document.querySelector(".parentList").insertAdjacentHTML( 'beforeend', toAppend );                                    
            })
        }else{
            var p = document.createElement("p");        
            var node = document.createTextNode("No sites saved. Go to the options menu to add sites.");
            p.appendChild(node);        
            parentList.appendChild(p)            
        }        
    });     
}

if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }

//


loadSavedSites()

}

document.addEventListener("DOMContentLoaded", function(){
    load()
})