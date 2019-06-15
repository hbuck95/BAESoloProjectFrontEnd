const statPath = "/stats";
let selectedStat;

async function getAllStats(display = true) {
    const location = "/getAllStats"
    let result = "";

    await makeRequest("GET", statPath + location, "")
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

