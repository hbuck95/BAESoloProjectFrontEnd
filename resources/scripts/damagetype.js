const dmgPath = "/damagetype";
let selectedDamageType;

async function getDamageTypes(display = true) {
    const location = "/getAllDamageTypes"
    let result = "";

    await makeRequest("GET", dmgPath + location, "")
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

