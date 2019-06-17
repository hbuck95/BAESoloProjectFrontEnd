const modePath = "/gamemode";
let selectedGameMode;

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
        }
        );

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
