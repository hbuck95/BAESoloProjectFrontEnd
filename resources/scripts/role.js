const rolePath = "/role";
let selectedRole;

let roleNameInput = document.getElementById("role-name");
let newRoleNameInput = document.getElementById("new-role-name");

async function getAllRoles(display = true) {
    const location = "/getAllRoles"
    let result = "";

    await makeRequest("GET", rolePath + location, "")
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
    id = (document.getElementById("search-box").value);
    const location = `/getRole/${id}`;

    //If no id is entered default to get all champions
    if (id == "") {
        getAllRoles();
        return;
    }

    let role = await makeRequest("GET", rolePath + location, "")
        .then(data => {
            return data;
        })
        .catch(error => {
            console.log(error);
        }
        );

    displayData(role, "deleteRole", "editRole", "newRole");
}


function getRole(id) {

    id = id === undefined ? document.getElementById("search-box").value : id;

    const location = `/getRole/${id}`;

    makeRequest("GET", rolePath + location, "")
        .then(data => {
            selectedRole = JSON.parse(data);
            return data;
        })
        .catch(error => {
            console.log(error);
        }
        );
}

async function editRole(id) {
    getRole(id);

    setTimeout(() => {
        idInput.value = id;
        roleNameInput.value = selectedRole.name;
    }), 1000

    document.getElementById("submit-btn").addEventListener("click", function () { updateRole(); });
}

function updateRole() {

    if (!window.confirm("Are you sure you want to update this record?")) {
        return;
    }

    const location = `/updateRole/${idInput.value}`;

    let updatedRecord = {
        "id": idInput.value,
        "name": `${roleNameInput.value}`
    };

    makeRequest("PUT", rolePath + location, JSON.stringify(updatedRecord))
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
    const location = `/deleteRole/${id}`;

    if (!window.confirm("Are you sure you want to delete this record?")) {
        return;
    }

    makeRequest("DELETE", rolePath + location, "")
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
    const location = '/createRole';

    newRoleNameInput.focus();
    newRoleNameInput.select();

    document.getElementById("new-submit-btn").addEventListener("click", async function () {

        let newRole = {
            "name": `${newRoleNameInput.value}`
        };

        console.log(newRole);

        await makeRequest("POST", rolePath + location, JSON.stringify(newRole)).then(response => {
            let reply = JSON.parse(response);
            alert(reply.message);
            window.location.reload();
        }).catch(error => console.log(error));

    });
}
