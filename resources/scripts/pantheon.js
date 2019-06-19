const PANTH_PATH = "/pantheon";

let pantheonNameInput = document.getElementById("pantheon-name");
let newPantheonNameInput = document.getElementById("new-pantheon-name");

async function getAllPantheons(display = true) {
    const LOCATION = "/getAllPantheons"
    let result = "";

    await makeRequest("GET", PANTH_PATH + LOCATION, "")
        .then(data => {
            if (display) {
                displayData(data, "deletePantheon", "editPantheon", "newPantheon");
            }
            result = data;
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    return result;

}

async function displayPantheon() {
    let id = (document.getElementById("search-box").value);
    const LOCATION = `/getPantheon/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllPantheons();
        return;
    }

    let panth = await makeRequest("GET", PANTH_PATH + LOCATION, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    displayData(panth, "deletePantheon", "editPantheon", "newPantheon");
}

//Retrieve a particular record from the database
async function getPantheon(id) {
    const LOCATION = `/getPantheon/${id}`;
    let result = "";

    makeRequest("GET", PANTH_PATH + LOCATION, "")
        .then(data => {
            result = data;
            return result;
        })
        .catch(error => {
            console.log(error);
        });
    return result;
}

async function editPantheon(id) {

    await getPantheon(id).then(panth => {
        let selectedPantheon = JSON.parse(panth);
        idInput.value = id;
        pantheonNameInput.value = selectedPantheon.name;
    });

    document.getElementById("submit-btn").addEventListener("click", function () { updatePantheon(); });
}

function updatePantheon() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const LOCATION = `/updatePantheon/${idInput.value}`;

    let updatedRecord = {
        "id": idInput.value,
        "name": `${pantheonNameInput.value}`
    };

    makeRequest("PUT", PANTH_PATH + LOCATION, JSON.stringify(updatedRecord))
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}

function deletePantheon(id) {
    const LOCATION = `/deletePantheon/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", PANTH_PATH + LOCATION, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
            window.alert("You can't delete this record as there are other records that rely on it!\nPlease delete the champions associated with this pantheon first.");
        });
}

async function newPantheon() {
    const LOCATION = '/createPantheon';

    newPantheonNameInput.focus();
    newPantheonNameInput.select();

    document.getElementById("new-submit-btn").addEventListener("click", async function () {

        let newPantheon = {
            "name": `${newPantheonNameInput.value}`
        };

        console.log(newPantheon);

        await makeRequest("POST", PANTH_PATH + LOCATION, JSON.stringify(newPantheon)).then(response => {
            let reply = JSON.parse(response);
            alert(reply.message);
            window.location.reload();
        }).catch(error => console.log(error));

    });
}