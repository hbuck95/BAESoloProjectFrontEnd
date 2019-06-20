const DMG_PATH = "/damagetype";
let selectedDamageType;

let dmgTypeNameInput = document.getElementById("dmgtype-name");
let newDmgTypeNameInput = document.getElementById("new-dmgtype-name");

async function getDamageTypes(display = true) {
    const LOCATION = "/getAllDamageTypes"
    let result = "";

    await makeRequest("GET", DMG_PATH + LOCATION, "")
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
    const LOCATION = `/getDamageType/${id}`;

    //If no id is entered default to get all damage types
    if (id == "") {
        getDamageTypes();
        return;
    }

    data = await makeRequest("GET", DMG_PATH + LOCATION, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    displayData(data, "deleteDamageType", "editDamageType", "newDamageType");
}

async function getDamageType(id) {
    const LOCATION = `/getDamageType/${id}`;
    let result = "";

    await makeRequest("GET", DMG_PATH + LOCATION, "")
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

    makeRequest("PUT", DMG_PATH + location, JSON.stringify(updatedRecord))
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}


function deleteDamageType(id) {
    const LOCATION = `/deleteDamageType/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", DMG_PATH + LOCATION, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
            window.alert("You can't delete this record as there are other records that rely on it!\nPlease delete the champions associated with this damage type first.");
        });
}

async function newDamageType() {
    const LOCATION = '/createDamageType';

    newDmgTypeNameInput.focus();
    newDmgTypeNameInput.select();

    document.getElementById("new-submit-btn").addEventListener("click", async function () {

        let newDamageType = {
            "name": `${newDmgTypeNameInput.value}`
        };

        //console.log(newDamageType);

        await makeRequest("POST", DMG_PATH + LOCATION, JSON.stringify(newDamageType)).then(response => {
            let reply = JSON.parse(response);
            alert(reply.message);
            window.location.reload();
        }).catch(error => console.log(error));

    });
}