const dmgPath = "/damagetype";
let selectedDamageType;

async function getDamageTypes(display = true) {
    const location = "/getAllDamageTypes"
    let result = "";

    await makeRequest("GET", dmgPath + location, "")
        .then(data => {
            if (display) {
                displayData(data, "deleteDamageType", "editDamageType", "newDamageType");
            }
            result = data;
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    return result;
}

async function displayDamageType() {
    id = (document.getElementById("search-box").value);
    const location = `/getDamageType/${id}`;

    //If no id is entered default to get all damage types
    if (id == "") {
        getDamageTypes();
        return;
    }

    data = await makeRequest("GET", dmgPath + location, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    displayData(data, "deleteDamageType", "editDamageType", "newDamageType");
}


