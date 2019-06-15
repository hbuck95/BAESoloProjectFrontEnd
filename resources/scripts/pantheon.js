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

