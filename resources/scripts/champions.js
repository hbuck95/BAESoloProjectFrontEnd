const CHAMPION_PATH = "/champion";
let selectedChampion;

let nameInput = document.getElementById("name");
let hpInput = document.getElementById("hp");
let damageInput = document.getElementById("damage");
let pantheonSelector = document.getElementById("pantheon-selection");
let roleSelector = document.getElementById("role-selection");
let damageSelector = document.getElementById("damage-selection");

let newNameInput = document.getElementById("new-name");
let newHpInput = document.getElementById("new-hp");
let newDamageInput = document.getElementById("new-damage");
let newPantheonSelector = document.getElementById("new-pantheon-selection");
let newRoleSelector = document.getElementById("new-role-selection");
let newDamageSelector = document.getElementById("new-damage-selection");


async function getAllChampions(display = true) {
    const LOCATION = "/getAllChampions"
    let result = "";

    await makeRequest("GET", CHAMPION_PATH + LOCATION, "")
        .then(data => {
            if (display) {
                displayData(data, "deleteChamp", "editChamp", "newChamp");
            }
            result = data;
            return data;
        })
        .catch(error => {
            console.log(error);
        }
        );

    return result;
}

async function displayChampion() {
    id = (document.getElementById("search-box").value);
    const LOCATION = `/getChampion/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllChampions();
        return;
    }

    champ = await makeRequest("GET", CHAMPION_PATH + LOCATION, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        }
        );


    displayData(champ, "deleteChamp", "editChamp", "newChamp");
}

//Retrieve a particular record from the database
async function getChampion(id) {
    const LOCATION = `/getChampion/${id}`;
    let result = "";

    await makeRequest("GET", CHAMPION_PATH + LOCATION, "")
        .then(data => {
            result = data;
            return result;
        })
        .catch(error => {
            console.log(error);
        });
    return result;
}

async function editChamp(id) {
    let pantheons = [];
    let roles = [];
    let damageTypes = [];

    await getChampion(id).then(champ => {
        selectedChampion = JSON.parse(champ);
    });
    await getAllPantheons(false).then(panths => {
        pantheons = JSON.parse(panths);
    });

    await getAllRoles(false).then(r => {
        roles = JSON.parse(r);
    });

    await getDamageTypes(false).then(dts => {
        damageTypes = JSON.parse(dts);
    });

    idInput.value = id;
    nameInput.value = selectedChampion.name;
    hpInput.value = selectedChampion.health;
    damageInput.value = selectedChampion.damage;

    populateOptionList(pantheonSelector, pantheons);
    populateOptionList(roleSelector, roles);
    populateOptionList(damageSelector, damageTypes);

    //Select the current pantheon by default
    for (let i = 0; i < pantheonSelector.options.length; i++) {
        if ((pantheonSelector.options[i].text) === selectedChampion.pantheon.name) {
            pantheonSelector.selectedIndex = i;
            break;
        }
    }

    //Select the current role by default
    for (let i = 0; i < roleSelector.options.length; i++) {
        if ((roleSelector.options[i].text) === selectedChampion.role.name) {
            roleSelector.selectedIndex = i;
            break;
        }
    }

    //Select the current role by default
    for (let i = 0; i < damageSelector.options.length; i++) {
        if ((damageSelector.options[i].text) === selectedChampion.damageType.name) {
            damageSelector.selectedIndex = i;
            break;
        }
    }

    document.getElementById("submit-btn").addEventListener("click", function () { updateChamp(); });
}

function deleteChamp(id) {
    const LOCATION = `/deleteChampion/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", CHAMPION_PATH + LOCATION, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
            window.alert("You can't delete this record as there are stats that rely on it!\nPlease delete the stats associated with this champion first.");
        });
}

function updateChamp() {
    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const location = `/updateChampion/${idInput.value}`;

    let updatedRecord = {
        "id": `${idInput.value}`,
        "name": `${nameInput.value}`,
        "role": {
            "id": `${roleSelector[roleSelector.selectedIndex].id}`,
            "name": `${roleSelector[roleSelector.selectedIndex].text}`,
        },
        "pantheon": {
            "id": `${pantheonSelector[pantheonSelector.selectedIndex].id}`,
            "name": `${pantheonSelector[pantheonSelector.selectedIndex].text}`,
        },
        "damageType": {
            "id": `${damageSelector[damageSelector.selectedIndex].id}`,
            "name": `${damageSelector[damageSelector.selectedIndex].text}`,
        },
        "health": `${hpInput.value}`,
        "damage": `${damageInput.value}`
    };

    makeRequest("PUT", CHAMPION_PATH + location, JSON.stringify(updatedRecord))
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        }
        );
}

async function newChamp() {
    await getAllPantheons(false).then(panths => {
        populateOptionList(newPantheonSelector, JSON.parse(panths));
    });

    await getAllRoles(false).then(r => {
        populateOptionList(newRoleSelector, JSON.parse(r));
    });

    await getDamageTypes(false).then(dts => {
        populateOptionList(newDamageSelector, JSON.parse(dts));
    });

    document.getElementById("new-submit-btn").addEventListener("click", function () { saveNewChamp(); });
}

async function saveNewChamp() {
    const LOCATION = '/createChampion';

    let pantheons = [];
    let roles = [];
    let damageTypes = [];

    await getAllPantheons(false).then(panths => {
        pantheons = JSON.parse(panths);
    });

    await getAllRoles(false).then(r => {
        roles = JSON.parse(r);
    });

    await getDamageTypes(false).then(dts => {
        damageTypes = JSON.parse(dts);
    });

    let champ = {
        "name": `${newNameInput.value}`,
        "role": (roles.filter(x => x.id == newRoleSelector[newRoleSelector.selectedIndex].id))[0],
        "pantheon": (pantheons.filter(x => x.id == newPantheonSelector[newPantheonSelector.selectedIndex].id))[0],
        "damageType": (damageTypes.filter(x => x.id == newDamageSelector[newDamageSelector.selectedIndex].id))[0],
        "health": newHpInput.value,
        "damage": newDamageInput.value
    };

    await makeRequest("POST", CHAMPION_PATH + LOCATION, JSON.stringify(champ)).then(response => {
        let reply = JSON.parse(response);
        alert(reply.message);
        window.location.reload();
    }).catch(error => console.log(error));

}
