const api = "http://localhost:8080/BAESoloProject/api";

function makeRequest(method, url, body) {
    console.log("Making new promise");
    return new Promise((res, rej) => {
        console.log(api + url);
        const req = new XMLHttpRequest();
        req.open(method, api + url);

        req.onload = () => {
            console.log("On load");
            if (req.status >= 200 && req.status < 300) {
                res(req.responseText);
            } else {
                rej(req.statusText);
            }
        };
        req.send(body);
    });
}

function displayData(data) {
    console.log("Displaying data");
    let entity = []; //Reset this variable

    let parsedData = JSON.parse(data); //Convert the json data to an object
    let table = document.getElementById("tbl");

    //If the JSON is an array (more than 1 record) join the arrays otherwise push the record into the array
    Array.isArray(parsedData) ? entity = entity.concat(parsedData) : entity.push(parsedData);

    //If the table already exists remove it
    if (!!table) {
        console.log("table exists");
        document.getElementById("data-table").removeChild(table);
    }

    //Set up the initial table
    table = document.createElement("table");
    table.className = "table table-hover"; //Bootstrap
    table.id = "tbl";
    let head = table.createTHead();
    head.className = "thead-dark"; //Bootstrap      

    //Create table headers using an objects   
    for (let key of Object.keys(entity[0])) {
        let cell = document.createElement("th");
        cell.innerHTML = "<b>" + key + "</b>";
        head.appendChild(cell);
    }

    // Create table header cell for the selection boxes
    let headCell = document.createElement("th");
    headCell.innerHTML = "<b>Actions</b>";
    head.appendChild(headCell);

    //Attach the table to the document
    document.getElementById("data-table").appendChild(table);

    //Start appending the data
    let body = table.createTBody();

    //Create table rows
    entity.forEach(element => {

        let row = body.insertRow();
        let cell;

        for (let property of Object.entries(element)) {

            //Create the cell for this entry
            cell = row.insertCell();

            //Pull the values form the object using deconstructers
            let [, value] = property;

            //The text which will be appended into the cell
            let textToAppend = value;

            //Look through the property retrieved from the other object and see if it has any nested objects
            //For my purpose there will be a maximum of 1 nested object so this will do the job
            for (let nestedObject of Object.entries(property)) {
                [, value] = nestedObject;
                if (value instanceof Object) {
                    textToAppend = value.name;//My nested property will always be called name.
                }
            }

            cell.append(document.createTextNode(textToAppend));

        }

        cell = row.insertCell();
        cell.setAttribute("id", element["id"]);


        let editBtn = document.createElement("button");
        editBtn.setAttribute("class", "btn btn-outline-info edit-btn");
        editBtn.setAttribute("id", element["id"]);
        editBtn.setAttribute("innerHTML", "[Edit]");
        editBtn.innerHTML = "Edit";

        let delBtn = document.createElement("button");
        delBtn.setAttribute("class", "btn btn-outline-info");
        delBtn.innerHTML = "Delete";


        cell.append(editBtn);
        cell.append(document.createTextNode(" "));
        cell.append(delBtn);
        editBtn.setAttribute("onclick", `editRecord(${editBtn.parentElement.id});`);
        editBtn.setAttribute("data-toggle", "modal");
        editBtn.setAttribute("data-target", "#myModal");

        delBtn.setAttribute("onclick", `deleteRecord(${delBtn.parentElement.id})`);


    });
}