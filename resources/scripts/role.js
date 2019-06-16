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

