const panthPath = "/pantheon";
let selectedPantheon;

let pantheonNameInput = document.getElementById("pantheon-name");
let newPantheonNameInput = document.getElementById("new-pantheon-name");

async function getAllPantheons(display = true) {
    const location = "/getAllPantheons"
    let result = "";

    await makeRequest("GET", panthPath + location, "")
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
        });

    displayData(panth, "deletePantheon", "editPantheon", "newPantheon");
}

function getPantheon(id) {

    id = id === undefined ? document.getElementById("search-box").value : id;

    const location = `/getPantheon/${id}`;

    makeRequest("GET", panthPath + location, "")
        .then(data => {
            selectedPantheon = JSON.parse(data);
            return data;
        })
        .catch(error => {
            console.log(error);
        });
}

async function editPantheon(id) {
    getPantheon(id);

    setTimeout(() => {
        idInput.value = id;
        pantheonNameInput.value = selectedPantheon.name;
    }), 1000

    document.getElementById("submit-btn").addEventListener("click", function () { updatePantheon(); });
}

function updatePantheon() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const location = `/updatePantheon/${idInput.value}`;

    let updatedRecord = {
        "id": idInput.value,
        "name": `${pantheonNameInput.value}`
    };

    makeRequest("PUT", panthPath + location, JSON.stringify(updatedRecord))
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
    const location = `/deletePantheon/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", panthPath + location, "")
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
    const location = '/createPantheon';

    newPantheonNameInput.focus();
    newPantheonNameInput.select();

    document.getElementById("new-submit-btn").addEventListener("click", async function () {

        let newPantheon = {
            "name": `${newPantheonNameInput.value}`
        };

        console.log(newPantheon);

        await makeRequest("POST", panthPath + location, JSON.stringify(newPantheon)).then(response => {
            let reply = JSON.parse(response);
            alert(reply.message);
            window.location.reload();
        }).catch(error => console.log(error));

    });
}