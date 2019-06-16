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

