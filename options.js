function load(){

    var editName = document.querySelector("#editName")
    var editURL = document.querySelector("#editURL")
    var atSpan = document.querySelector("#atSpan")
    var editButton = document.querySelector("#editSave")
    var editCancel = document.querySelector("#editCancel")
    
    var origName = ""
    var origURL = ""
    var origSubsiteName = ""
    var origSubsiteUrl = ""
    var childOrParent = ''
    
    

    document.querySelector(".plusButton").addEventListener('click',function(){
        const subsiteBoxes = document.querySelectorAll("#subsites input")
        const subsiteContainer = document.querySelector("#subsites")
                
        // take textboses to labels
        let subsitename = subsiteBoxes[0].value
        let subsiteurl = subsiteBoxes[1].value

        var p = document.createElement("p");        
        var node = document.createTextNode( subsitename+" @ "+ subsiteurl);
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

    //Save site to storage
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
                let split = s.textContent.split(" @ ")
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
                var duplicate = false
                userKeyIds.forEach( u =>{
                    if(u != null){
                        if(u.siteUrl == saveObject.siteUrl)
                        {
                            duplicate = true
                            saveObject.subsites.forEach(s => {
                                u.subsites.push(s)
                            })
                            
                            u.subsites = u.subsites.filter(function(item, pos, self) {
                                return self.indexOf(item) == pos;
                            })   
                        }
                    }
                })
                if (!duplicate){
                    userKeyIds.push(saveObject);
                }
                
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

    //load sites on page load
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
                let siteSection = "<li><p>{0} @ {1}</p><span class='x'>X</span><span class='e'>E</span>"
                let subsiteSelection =  "<li><p>{0} @ {1}</p><span class='x'>X</span><span class='e'>E</span></li>";
                storageSite.forEach(function(s){
                    if(s != null){
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
                    }       
                })                
            }else{
                var p = document.createElement("p");        
                var node = document.createTextNode("No sites saved.");
                p.appendChild(node);        
                parentList.appendChild(p)
            }    
            var xs = document.querySelectorAll(".x")
            xs.forEach(x => {
                x.addEventListener('click', removeSiteOrChild)
            })
            var es = document.querySelectorAll(".e")
            es.forEach(e => {
                e.addEventListener('click', showEditControls)
            })
        });   
    }

    function removeSiteOrChild(){
        var node = this.parentNode
        var childOrParent = node.parentNode.id == "savedSites"? "P" : "C"

        switch (childOrParent) {
            case "P": 
                var siteName = node.firstChild.textContent.split(" @ ")[0]    
                
                chrome.storage.sync.get("Sites", function (result) {
                    storage = result["Sites"]                    
                    for (var i = 0; i < storage.length; i++) {
                        if(storage[i] != null){
                            if(storage[i].siteName == siteName)
                            {
                                //delete storage[i]
                                storage.splice(i,1)
                                break
                            }                            
                        }
                    }                    
                    chrome.storage.sync.set({"Sites": storage}, function () {
                        chrome.storage.sync.get("Sites", function (result) {
                            console.log(result)
                            loadSavedSites()                    
                        });
                    })
                })

                break;

            case "C": 
                var subsiteName = node.firstChild.textContent.split(" @ ")[0]    
                var siteName = node.parentNode.parentNode.firstChild.textContent.split(" @ ")[0]
                
                chrome.storage.sync.get("Sites", function (result) {
                    storage = result["Sites"]
                                        
                    for (var i = 0; i < storage.length; i++) {
                        if(storage[i] != null){
                            if(storage[i].siteName == siteName)
                            {
                                for (var n = 0; n < storage[i].subsites.length; n++) {
                                    if(storage[i].subsites != null)
                                    {
                                        if(storage[i].subsites[n].subsiteName == subsiteName)
                                        {
                                            storage[i].subsites.splice(n,1)
                                            break
                                        }
                                    } 
                                }                                                                
                            }                            
                        }
                    }    
                    chrome.storage.sync.set({"Sites": storage}, function () {
                        loadSavedSites()                    
                    })
                })
                break;
        
            default:
                break;
        }
    }

    function showEditControls(){
        var node = this.parentNode

        childOrParent = node.parentNode.id == "savedSites"? "P" : "C"        
        if(childOrParent == 'P'){
            origName = node.firstChild.textContent.split(" @ ")[0]
            origURL = node.firstChild.textContent.split(" @ ")[1]

            editName.value = origName
            editURL.value = origURL
        }else {
            origSubsiteName = node.firstChild.textContent.split(" @ ")[0]
            origSubsiteUrl = node.firstChild.textContent.split(" @ ")[1]
            origName = node.parentNode.parentNode.firstChild.textContent.split(" @ ")[0]

            editName.value = origSubsiteName
            editURL.value = origSubsiteUrl
        }

        editName.classList.remove('hidden')
        editURL.classList.remove('hidden')
        atSpan.classList.remove('hidden')
        editButton.classList.remove('hidden')
        editCancel.classList.remove('hidden')
    }

    function editSiteOrChild(){
        var node = this.parentNode             

        switch (childOrParent) {
            case "P":                
                chrome.storage.sync.get("Sites", function (result) {
                    storage = result["Sites"]                    
                    for (var i = 0; i < storage.length; i++) {
                        if(storage[i] != null){
                            if(storage[i].siteName == origName)
                            {
                                storage[i].siteName = editName.value
                                storage[i].siteUrl = editURL.value                                
                                break
                            }                            
                        }
                    }                    
                    chrome.storage.sync.set({"Sites": storage}, function () {
                        chrome.storage.sync.get("Sites", function (result) {
                            console.log(result)
                            loadSavedSites()                    
                        });
                    })
                })

                break;

            case "C":                                 
                chrome.storage.sync.get("Sites", function (result) {
                    storage = result["Sites"]                                        
                    for (var i = 0; i < storage.length; i++) {
                        if(storage[i] != null){
                            if(storage[i].siteName == origName)
                            {
                                for (var n = 0; n < storage[i].subsites.length; n++) {
                                    if(storage[i].subsites != null)
                                    {
                                        if(storage[i].subsites[n].subsiteName == origSubsiteName)
                                        {
                                            storage[i].subsites[n].subsiteName = editName.value
                                            storage[i].subsites[n].subsiteUrl = editURL.value
                                            
                                            break
                                        }
                                    } 
                                }                                                                
                            }                            
                        }
                    }    
                    chrome.storage.sync.set({"Sites": storage}, function () {
                        loadSavedSites()                    
                    })
                })
                break;
        
            default:
                break;
        }
    }

    // String interpolation
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

    loadSavedSites()
    
    editSave.addEventListener('click', editSiteOrChild)

    editCancel.addEventListener('click', function(){
        editName.classList.add('hidden')
        editURL.classList.add('hidden')
        atSpan.classList.add('hidden')
        editButton.classList.add('hidden')
        editCancel.classList.add('hidden')
    })
    

}

document.addEventListener('DOMContentLoaded',load())