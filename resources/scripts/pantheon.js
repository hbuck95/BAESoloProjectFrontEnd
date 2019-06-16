const panthPath = "/pantheon";
let selectedPantheon;

async function getAllPantheons(display = true) {
    const location = "/getAllPantheons"
    let result = "";

    await makeRequest("GET", panthPath + location, "")
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

async function displayPantheon() {
    id = (document.getElementById("search-box").value);
    const location = `/getPantheon/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllPantheons();
        return;
    }

    panth = await makeRequest("GET", panthPath + location, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        }
        );

    displayData(panth, "deletePantheon", "editPantheon", "newPantheon");
}

