const ROLE_PATH = "/role";
let selectedRole;

let roleNameInput = document.getElementById("role-name");
let newRoleNameInput = document.getElementById("new-role-name");

async function getAllRoles(display = true) {
    const LOCATION = "/getAllRoles"
    let result = "";

    await makeRequest("GET", ROLE_PATH + LOCATION, "")
        .then(data => {
            if (display) {
                displayData(data, "deleteRole", "editRole", "newRole");
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

async function displayRole() {
    let id = (document.getElementById("search-box").value);
    const LOCATION = `/getRole/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllRoles();
        return;
    }

    let role = await makeRequest("GET", ROLE_PATH + LOCATION, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        });

    displayData(role, "deleteRole", "editRole", "newRole");
}


//Retrieve a particular record from the database
async function getRole(id) {
    const LOCATION = `/getRole/${id}`;
    let result = "";

    await makeRequest("GET", ROLE_PATH + LOCATION, "")
        .then(data => {
            result = data;
            return result;
        })
        .catch(error => {
            console.log(error);
        });
    return result;
}

async function editRole(id) {
    await getRole(id).then(role => {
        let selectedRole = JSON.parse(role);
        idInput.value = id;
        roleNameInput.value = selectedRole.name;
    });

    document.getElementById("submit-btn").addEventListener("click", function () { updateRole(); });
}

function updateRole() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const LOCATION = `/updateRole/${idInput.value}`;

    let updatedRecord = {
        "id": idInput.value,
        "name": `${roleNameInput.value}`
    };

    makeRequest("PUT", ROLE_PATH + LOCATION, JSON.stringify(updatedRecord))
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

function deleteRole(id) {
    const LOCATION = `/deleteRole/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", ROLE_PATH + LOCATION, "")
        .then(resp => {
            const response = JSON.parse(resp);
            window.alert(response.message);
        })
        .catch(error => {
            window.alert("You can't delete this record as there are other records that rely on it!\nPlease delete the champions associated with this role first.");
        }
        );
}

async function newRole() {
    const LOCATION = '/createRole';

    newRoleNameInput.focus();
    newRoleNameInput.select();

    document.getElementById("new-submit-btn").addEventListener("click", async function () {

        let newRole = {
            "name": `${newRoleNameInput.value}`
        };

        console.log(newRole);

        await makeRequest("POST", ROLE_PATH + LOCATION, JSON.stringify(newRole)).then(response => {
            let reply = JSON.parse(response);
            alert(reply.message);
            window.location.reload();
        }).catch(error => console.log(error));

    });
}
