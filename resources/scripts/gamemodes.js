const MODE_PATH = "/gamemode";

let gameModeNameInput = document.getElementById("gamemode-name");
let newGameModeNameInput = document.getElementById("new-gamemode-name");

async function getAllGameModes(display = true) {
    const LOCATION = "/getAllGameModes"
    let result = "";

    await makeRequest("GET", MODE_PATH + LOCATION, "")
        .then(data => {
            if (display) {
                displayData(data, "deleteGameMode", "editGameMode", "newGameMode");
            }
            result = data;
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    return result;
}

async function displayGameMode() {
    id = (document.getElementById("search-box").value);
    const LOCATION = `/getGameMode/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllGameModes();
        return;
    }

    mode = await makeRequest("GET", MODE_PATH + LOCATION, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    displayData(mode, "deleteGameMode", "editGameMode", "newGameMode");
}

//Retrieve a particular record from the database
async function getGameMode(id) {
    const LOCATION = `/getGameMode/${id}`;
    let result = "";

    await makeRequest("GET", MODE_PATH + LOCATION, "")
        .then(data => {
            result = data;
            return result;
        })
        .catch(error => {
            console.log(error);
        });
    return result;
}

async function editGameMode(id) {
    await (getGameMode(id)).then(mode => {
        let selectedGameMode = JSON.parse(mode);
        idInput.value = id;
        gameModeNameInput.value = selectedGameMode.name;
    });

    document.getElementById("submit-btn").addEventListener("click", function () { updateGameMode(); });
}

function updateGameMode() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const LOCATION = `/updateGameMode/${idInput.value}`;

    let updatedRecord = {
        "id": idInput.value,
        "name": `${gameModeNameInput.value}`
    };

    makeRequest("PUT", MODE_PATH + LOCATION, JSON.stringify(updatedRecord))
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}

async function newGameMode() {
    const LOCATION = '/createGameMode';

    newGameModeNameInput.focus();
    newGameModeNameInput.select();

    document.getElementById("new-submit-btn").addEventListener("click", async function () {

        let newMode = {
            "name": `${newGameModeNameInput.value}`
        };

        console.log(newPantheon);

        await makeRequest("POST", MODE_PATH + LOCATION, JSON.stringify(newMode)).then(response => {
            let reply = JSON.parse(response);
            alert(reply.message);
            window.location.reload();
        }).catch(error => console.log(error));

    });
}

function deleteGameMode(id) {
    const LOCATION = `/deleteGameMode/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", MODE_PATH + LOCATION, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
            window.alert("You can't delete this record as there are other records that rely on it!\nPlease delete the stats associated with this game mode first.");
        });
}
