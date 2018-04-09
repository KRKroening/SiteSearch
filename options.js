function load(){


    document.querySelector(".plusButton").addEventListener('click',function(){
        const subsiteBoxes = document.querySelectorAll("#subsites input")
        const subsiteContainer = document.querySelector("#subsites")
                
        // take textboses to labels
        let subsitename = subsiteBoxes[0].value
        let subsiteurl = subsiteBoxes[1].value

        var p = document.createElement("p");        
        var node = document.createTextNode( subsitename+" at"+ subsiteurl);
        p.appendChild(node);        
        subsiteContainer.appendChild(p)
    
        //clear text boxes
        subsiteBoxes.forEach(s => {
            s.value = ""
        });
    })

    function clearBoxes(){
        subsiteText =  document.querySelectorAll("#subsites p")
        subsiteText.forEach(s => {
            s.remove()
        });
        document.querySelector("#site").value = ""
        document.querySelector("#siteUrl").value = ""        
    }

    document.querySelector("#clear").addEventListener('click', function(){
        chrome.storage.sync.clear()
        loadSavedSites()
    })

    document.querySelector("#save").addEventListener('click',function(){
        let saveObject = {
            siteName : "",
            siteUrl : "",
            subsites : []            
        }
        
        let site = document.querySelector("#site")
        let siteurl = document.querySelector("#siteurl")

        saveObject["siteName"] = site.value
        saveObject["siteUrl"] = siteurl.value

        let subsites = document.querySelectorAll("#subsites p")
        if(subsites.length > 0)
        {
            subsites.forEach(function(s){
                let split = s.textContent.split(" ")
                var subObject = {
                    subsiteName : split[0],
                    subsiteUrl : split[1]
                }

                saveObject["subsites"].push(subObject)
            })
        }

        chrome.storage.sync.get("Sites", function (result) {
            // the input argument is ALWAYS an object containing the queried keys
            // so we select the key we need
            var userKeyIds = result["Sites"];
            if (userKeyIds == undefined)
            {
                userKeyIds = new Array(saveObject)
            }else{
                userKeyIds.push(saveObject);                
            }
            // set the new array value to the same key
            chrome.storage.sync.set({"Sites": userKeyIds}, function () {
                // you can use strings instead of objects
                // if you don't  want to define default values
                chrome.storage.sync.get("Sites", function (result) {
                    console.log(result)
                    loadSavedSites()                    
                });
            });
        });

        clearBoxes()
    })

    function loadSavedSites(){
        let parentList = document.querySelector("#savedSites")
        while (parentList.firstChild) {
            parentList.removeChild(parentList.firstChild);
        }
        let storageSite

        chrome.storage.sync.get("Sites", function (result) {
            storageSite = result["Sites"]
        
            if(storageSite.length > 0)
            {                            
                let siteSection = "<li><p>{0} @ {1}</p>"
                let subsiteSelection =  "<li><p>{0} @ {1}</p></li>";
                storageSite.forEach(function(s){
                    let toAppend = "";
                    toAppend += siteSection.format( s["siteName"], s["siteUrl"])
                    if(s["subsites"].length > 0){
                        toAppend += "<ul>"
                        s["subsites"].forEach(function(s){
                            toAppend+= subsiteSelection.format(s["subsiteName"],s["subsiteUrl"])
                        })
                        toAppend += "</ul>"
                    }
                    toAppend+= "</li>"                    
                    document.querySelector("#savedSites").insertAdjacentHTML( 'beforeend', toAppend );         
                })                
            }else{
                var p = document.createElement("p");        
                var node = document.createTextNode("No sites saved.");
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

    chrome.storage.sync.get("Sites", function (result) {
        console.log(result)
    });

    loadSavedSites()

}

document.addEventListener('DOMContentLoaded',load())