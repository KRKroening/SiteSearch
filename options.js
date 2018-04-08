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

    document.querySelector("#clear").addEventListener('click', chrome.storage.sync.clear())

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

        // chrome.storage.local.set({"Sites": []}, function() {            
        //   });
        // localStorage.setItem("Sites", s aveObject)
        // if(localStorage.hasOwnProperty("Sites"))
        // {
        //     localStorage["Sites"].push([JSON.stringify(saveObject)])            
        // } else{
        //     localStorage["Sites"] = new Array()
        //     localStorage["Sites"].push(JSON.stringify(saveObject))
        // }
        // console.log(localStorage)
        // localStorage["Sites"]["sites"].push(saveObject)

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
                });
            });
        });
    })

}

document.addEventListener('DOMContentLoaded',load())