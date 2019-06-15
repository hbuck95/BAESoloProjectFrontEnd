const path = "/champion";
let selectedChampion;




getAllChampions();


function getAllChampions() {
    const location = "/getAllChampions"
    console.log("Get all champions");

    makeRequest("GET", path + location, "")
        .then(data => {
            displayData(data);
        })
        .catch(error => {
            console.log(error);
        }
        );
}

function getChampion(id) {
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

function editRecord(id) {
    let idInput = document.getElementById("id");
    let nameInput = document.getElementById("name");
    let pantheonInput = document.getElementById("pantheon");
    let damageTypeInput = document.getElementById("damagetype");
    let hpInput = document.getElementById("hp");
    let damageInput = document.getElementById("damage");

    getChampion(id);

    setTimeout(() => {
        idInput.value = id;
        nameInput.value = selectedChampion.name;
        pantheonInput.value = selectedChampion.pantheon.name;
        damageTypeInput.value = selectedChampion.damageType.name;
        hpInput.value = selectedChampion.health;
        damageInput.value = selectedChampion.damage;
    }), 1000
}

function deleteRecord(id) {
    const location = `/deleteChampion/${id}`;


    if(!window.confirm("Are you sure you want to delete this record?")){
        return;
    }

    makeRequest("DELETE", path+location, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            toggleAccountForm("hidden");
            resetForm();
        })
        .catch(error => {
            window.alert("You can't delete this record as there are stats that rely on it!\nPlease delete the stats associated with this champion first.");
        }
        );

}

function updateRecord() {
    let idInput = document.getElementById("id");
    let nameInput = document.getElementById("name");
    let pantheonInput = document.getElementById("pantheon");
    let damageTypeInput = document.getElementById("damagetype");
    let hpInput = document.getElementById("hp");
    let damageInput = document.getElementById("damage");

    const location = `/updateChampion/${idInput.value}`;

    let updatedRecord = {
        "id": `${idInput.value}`,
        "name": `${nameInput.value}`,
        "role": {
            "id": 1,
            "name": "Guardian"
        },
        "pantheon": {
            "id": 1,
            "name": "Norse"
        },
        "damageType": {
            "id": 1,
            "name": "Magical"
        },
        "health": `${hpInput.value}`,
        "damage": `${damageInput.value}`
    };

    makeRequest("PUT", path + location, JSON.stringify(updatedRecord))
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
        })
        .catch(error => {
            console.log(error);
        }
        );

}
