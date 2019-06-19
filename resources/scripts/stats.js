const STAT_PATH = "/stats";
let selectedStat;

//Edit record input fields
let winrateInput = document.getElementById("winrate");
let pickrateInput = document.getElementById("pickrate");
let banrateInput = document.getElementById("banrate");
let championSelector = document.getElementById("champion-selection");
let gamemodeSelector = document.getElementById("gamemode-selection");

//New record input fields
let newChampionSelector = document.getElementById("new-champion-selection");
let newGamemodeSelector = document.getElementById("new-gamemode-selection");
let newWinrateInput = document.getElementById("newwinrate");
let newPickrateInput = document.getElementById("newpickrate");
let newBanrateInput = document.getElementById("newbanrate");

//Retrieve all stat records from the database
async function getAllStats(display = true) {
    const LOCATION = "/getAllStats"
    let result = "";

    await makeRequest("GET", STAT_PATH + LOCATION, "")
        .then(data => {
            if (display) {
                displayData(data, "deleteStat", "editStat", "newStat");
            }
            result = data;
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    return result;
}

//Delete a record
function deleteStat(id) {
    const LOCATION = `/deleteStats/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", STAT_PATH + LOCATION, "")
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

//Get an individual record to display
async function displayStat() {
    id = (document.getElementById("search-box").value);
    const LOCATION = `/getStats/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllStats();
        return;
    }

    let stat = await makeRequest("GET", STAT_PATH + LOCATION, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    displayData(stat, "deleteStat", "editStat", "newStat");
}

//Retrieve a particular record from the database
function getStat(id) {
    const LOCATION = `/getStats/${id}`;
    let result = "";

    makeRequest("GET", STAT_PATH + LOCATION, "")
        .then(data => {
            result = data;
            return result;
        })
        .catch(error => {
            console.log(error);
        });
    return result;
}

//Setup the new stat input screen
async function newStat() {
    await getAllChampions(false).then(champs => {
        populateOptionList(newChampionSelector, JSON.parse(champs));
    });

    await getAllGameModes(false).then(modes => {
        populateOptionList(newGamemodeSelector, JSON.parse(modes));
    })

    document.getElementById("new-submit-btn").addEventListener("click", function () { saveNewStats(); });
}

//Push the newly created stat to the database
async function saveNewStats() {
    let stat = {
        "champion": {},
        "gameMode": {},
        "winRate": -1,
        "pickRate": -1,
        "banRate": -1
    }

    let champions = [];
    let gameModes = [];

    const LOCATION = '/createStats';

    await getAllChampions(false).then(champs => {
        champions = JSON.parse(champs);
    });

    await getAllGameModes(false).then(modes => {
        gameModes = JSON.parse(modes);
    })

    let updatedChamp = champions.filter(x => x.id == newChampionSelector[newChampionSelector.selectedIndex].id);
    let updatedMode = gameModes.filter(x => x.id == newGamemodeSelector[newGamemodeSelector.selectedIndex].id);
    stat.winRate = newWinrateInput.value;
    stat.pickRate = newPickrateInput.value;
    stat.banRate = newBanrateInput.value;
    stat.champion = updatedChamp[0];
    stat.gameMode = updatedMode[0];

    await makeRequest("POST", STAT_PATH + LOCATION, JSON.stringify(stat)).then(response => {
        let reply = JSON.parse(response);
        alert(reply.message);
        window.location.reload();
    }).catch(error => console.log(error));

}

//Setup the edit record form
async function editStat(id) {

    await getStat(id).then(stat => {
        selectedStat = JSON.parse(stat);
    });

    idInput.value = id;
    winrateInput.value = selectedStat.winRate;
    pickrateInput.value = selectedStat.pickRate;
    banrateInput.value = selectedStat.banRate;

    await getAllChampions(false).then(champs => {
        populateOptionList(championSelector, JSON.parse(champs));
    });

    await getAllGameModes(false).then(modes => {
        populateOptionList(gamemodeSelector, JSON.parse(modes));
    });

    //Select the current champion by default
    for (let i = 0; i < championSelector.options.length; i++) {
        if ((championSelector.options[i].id) == selectedStat.champion.id) {
            console.log("found it");
            championSelector.selectedIndex = i;
            break;
        }
    }

    //Select the current game mode by default
    for (let i = 0; i < gamemodeSelector.options.length; i++) {
        if ((gamemodeSelector.options[i].id) == selectedStat.gameMode.id) {
            gamemodeSelector.selectedIndex = i;
            break;
        }
    }

    document.getElementById("submit-btn").addEventListener("click", function () { updateStat(); });
}

//Save record changes to the database
async function updateStat() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const LOCATION = `/updateStats/${idInput.value}`;

    let champions = [];
    let gameModes = [];

    await getAllChampions(false).then(champs => {
        champions = JSON.parse(champs);
    });

    await getAllGameModes(false).then(modes => {
        gameModes = JSON.parse(modes);
    })

    let updatedChamp = champions.filter(x => x.id == championSelector[championSelector.selectedIndex].id);
    let updatedMode = gameModes.filter(x => x.id == gamemodeSelector[gamemodeSelector.selectedIndex].id);

    //Assign updated values;
    let updatedRecord = {};
    Object.assign(updatedRecord, selectedStat);
    updatedRecord.champion = updatedChamp[0];
    updatedRecord.gameMode = updatedMode[0];
    updatedRecord.winRate = winrateInput.value;
    updatedRecord.banRate = banrateInput.value;
    updatedRecord.pickRate = pickrateInput.value;

    makeRequest("PUT", STAT_PATH + LOCATION, JSON.stringify(updatedRecord))
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}
