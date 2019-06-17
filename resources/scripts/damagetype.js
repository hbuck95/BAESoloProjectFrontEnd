const dmgPath = "/damagetype";
let selectedDamageType;

let dmgTypeNameInput = document.getElementById("dmgtype-name");
let newDmgTypeNameInput = document.getElementById("new-dmgtype-name");

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

async function getDamageType(id) {
    id = id === undefined ? document.getElementById("search-box").value : id;
    const location = `/getDamageType/${id}`;
    let result = "";

    await makeRequest("GET", dmgPath + location, "")
        .then(data => {
            selectedDamageType = JSON.parse(data);
            result = data;
            return data;
        })
        .catch(error => {
            console.log(error);
        });
    return result;
}

async function editDamageType(id) {
    getDamageType(id);

    await getDamageType(id).then(dt => {
        idInput.value = id;
        dmgTypeNameInput.value = JSON.parse(dt).name;

    }).catch(error => console.log(error));

    document.getElementById("submit-btn").addEventListener("click", function () { updateDamageType(); });
}

function updateDamageType() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const location = `/updateDamageType/${idInput.value}`;

    let updatedRecord = {
        "id": idInput.value,
        "name": `${dmgTypeNameInput.value}`
    };

    makeRequest("PUT", dmgPath + location, JSON.stringify(updatedRecord))
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}
