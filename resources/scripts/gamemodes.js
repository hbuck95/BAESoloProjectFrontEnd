const modePath = "/gamemode";
let selectedGameMode;

async function getAllGameModes(display = true) {
    const location = "/getAllGameModes"
    let result = "";

    await makeRequest("GET", modePath + location, "")
        .then(data => {
            if (display) {
                displayData(data);
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

