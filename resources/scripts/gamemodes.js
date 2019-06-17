const modePath = "/gamemode";
let selectedGameMode;

let gameModeNameInput = document.getElementById("gamemode-name");
let newGameModeNameInput = document.getElementById("new-gamemode-name");

async function getAllGameModes(display = true) {
    const location = "/getAllGameModes"
    let result = "";

    await makeRequest("GET", modePath + location, "")
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
    const location = `/getGameMode/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllGameModes();
        return;
    }

    mode = await makeRequest("GET", modePath + location, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    displayData(mode, "deleteGameMode", "editGameMode", "newGameMode");
}

function getGameMode(id) {
    id = id === undefined ? document.getElementById("search-box").value : id;
    const location = `/getGameMode/${id}`;

    makeRequest("GET", modePath + location, "")
        .then(data => {
            selectedGameMode = JSON.parse(data);
            return data;
        })
        .catch(error => {
            console.log(error);
        });
}

async function editGameMode(id) {
    getGameMode(id);

    setTimeout(() => {
        idInput.value = id;
        gameModeNameInput.value = selectedGameMode.name;
    }), 1000

    document.getElementById("submit-btn").addEventListener("click", function () { updateGameMode(); });
}

function updateGameMode() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const location = `/updateGameMode/${idInput.value}`;

    let updatedRecord = {
        "id": idInput.value,
        "name": `${gameModeNameInput.value}`
    };

    makeRequest("PUT", modePath + location, JSON.stringify(updatedRecord))
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
    const location = '/createGameMode';

    newGameModeNameInput.focus();
    newGameModeNameInput.select();

    document.getElementById("new-submit-btn").addEventListener("click", async function () {

        let newMode = {
            "name": `${newGameModeNameInput.value}`
        };

        console.log(newPantheon);

        await makeRequest("POST", modePath + location, JSON.stringify(newMode)).then(response => {
            let reply = JSON.parse(response);
            alert(reply.message);
            window.location.reload();
        }).catch(error => console.log(error));

    });
}

function deleteGameMode(id) {
    const location = `/deleteGameMode/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", modePath + location, "")
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
