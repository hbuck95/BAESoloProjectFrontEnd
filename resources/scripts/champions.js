const path = "/champion";
let selectedChampion;

async function getAllChampions(display = true) {
    const location = "/getAllChampions"
    let result = "";

    await makeRequest("GET", path + location, "")
        .then(data => {
            if (display) {
                displayData(data, "deleteChamp", "editChamp");
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
    const location = `/getChampion/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllChampions();
        return;
    }

    champ = await makeRequest("GET", path + location, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        }
        );


    displayData(champ, "deleteChamp", "editChamp");
}

function getChampion(id) {

    id = id === undefined ? document.getElementById("search-box").value : id;

    const location = `/getChampion/${id}`;
    console.log("Get champion");

    makeRequest("GET", path + location, "")
        .then(data => {
            selectedChampion = JSON.parse(data);
            return data;
        })
        .catch(error => {
            console.log(error);
        }
        );
}

function editChamp(id) {
    let idInput = document.getElementById("id");
    let nameInput = document.getElementById("name");
    let hpInput = document.getElementById("hp");
    let damageInput = document.getElementById("damage");
    let pantheonSelector = document.getElementById("pantheon-selection");
    let roleSelector = document.getElementById("role-selection");
    let damageSelector = document.getElementById("damage-selection");

    getChampion(id);

    setTimeout(() => {
        idInput.value = id;
        nameInput.value = selectedChampion.name;
        hpInput.value = selectedChampion.health;
        damageInput.value = selectedChampion.damage;
    }), 1000

    getAllPantheons(false).then(panths => {

        let pantheons = JSON.parse(panths);

        if (pantheonSelector.options.length != pantheons.length) {
            pantheonSelector.options.length = 0;

            for (let p of pantheons) {

                let selection = document.createElement("option");
                selection.setAttribute("id", p.id);
                selection.text = p.name;
                pantheonSelector.add(selection);
            }
        }

        //Select the current pantheon by default
        for (let i = 0; i < pantheonSelector.options.length; i++) {
            if ((pantheonSelector.options[i].text) === selectedChampion.pantheon.name) {
                pantheonSelector.selectedIndex = i;
                break;
            }
        }

    });

    getAllRoles(false).then(roles => {

        let allRoles = JSON.parse(roles);

        if (roleSelector.options.length != allRoles.length) {
            roleSelector.options.length = 0;

            for (let r of allRoles) {
                let selection = document.createElement("option");
                selection.setAttribute("id", r.id);
                selection.text = r.name;
                roleSelector.add(selection);
            }

        }

        //Select the current role by default
        for (let i = 0; i < roleSelector.options.length; i++) {
            if ((roleSelector.options[i].text) === selectedChampion.role.name) {
                roleSelector.selectedIndex = i;
                break;
            }
        }

    });

    getDamageTypes(false).then(dmgs => {

        let dmgTypes = JSON.parse(dmgs);

        if (damageSelector.options.length != dmgTypes.length) {
            damageSelector.options.length = 0;

            for (let type of dmgTypes) {
                let selection = document.createElement("option");
                selection.setAttribute("id", type.id);
                selection.text = type.name;
                damageSelector.add(selection);
            }
        }

        //Select the current role by default
        for (let i = 0; i < damageSelector.options.length; i++) {
            if ((damageSelector.options[i].text) === selectedChampion.damageType.name) {
                damageSelector.selectedIndex = i;
                break;
            }
        }

    });

    document.getElementById("submit-btn").addEventListener("click", function () { updateChamp(); });


}

function deleteChamp(id) {
    const location = `/deleteChampion/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", path + location, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
        })
        .catch(error => {
            window.alert("You can't delete this record as there are stats that rely on it!\nPlease delete the stats associated with this champion first.");
        }
        );

}

function updateChamp() {
    let idInput = document.getElementById("id");
    let nameInput = document.getElementById("name");
    let hpInput = document.getElementById("hp");
    let damageInput = document.getElementById("damage");
    let pantheonSelector = document.getElementById("pantheon-selection");
    let roleSelector = document.getElementById("role-selection");
    let damageSelector = document.getElementById("damage-selection");

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

    makeRequest("PUT", path + location, JSON.stringify(updatedRecord))
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
