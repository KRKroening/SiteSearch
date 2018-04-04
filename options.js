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


    document.querySelector("button").addEventListener('click',function(){
        let saveObject = {
            siteName : "",
            siteUrl : "",
            subsites : []            
        }
        
        let site = document.querySelector("#site")
        let siteurl = document.querySelector("#siteurl")

        saveObject["siteName"] = site
        saveObject["siteUrl"] = siteurl

        let subsites = document.querySelectorAll("#subsites p")
        if(subsites.length > 0)
        {
            subsites.forEach(function(s){
                let split = s.split(" ")
                var subObject = {
                    subsiteName : split[0],
                    subsiteUrl : split[1]
                }

                saveObject["subsites"].push(subObject)
            })
        }

        localStorage["sites"].push(saveObject)
    })

}

document.addEventListener('DOMContentLoaded',load())