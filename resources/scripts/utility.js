const api = "/BAESoloProject/api";

let idInput = document.getElementById("id"); //Used by each entity and so declare once in a shared class.


//Populate an options list with the provided data
//Refactored into own method due to wide usage
function populateOptionList(optionList, dataArray) {
    if (optionList.options.length != dataArray.length) {
        optionList.options.length = 0; //If they are not equal then remove all options and repopulate it as there could a DB entry change

        for (let data of dataArray) {
            let option = document.createElement("option");
            option.setAttribute("id", data.id);
            option.text = data.name;
            optionList.add(option);
        }
    }
}

async function makeRequest(method, url, body) {
    return new Promise((res, rej) => {
        const req = new XMLHttpRequest();
        req.open(method, api + url);

        req.onload = () => {
            if (req.status >= 200 && req.status < 300) {
                res(req.responseText);
            } else {
                rej(req.statusText);
            }
        };
        req.send(body);
    });
}

function camelCaseToString(input){
    return input.charAt(0).toUpperCase() + input.slice(1).replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
}

/*
data - the data to display
delFunc - the function for deleting records
upFunc - the function for updating records
newFunc - the function for creating new records
*/
function displayData(data, delFunc, upFunc, newFunc) {
    let entity = []; //Reset this variable

    let parsedData = JSON.parse(data); //Convert the json data to an object
    let table = document.getElementById("tbl");

    //If the JSON is an array (more than 1 record) join the arrays otherwise push the record into the array
    Array.isArray(parsedData) ? entity = entity.concat(parsedData) : entity.push(parsedData);

    //Sort the data by id, occassionally if mutliple actions happen quickly the database does not send the records in order.
    entity.sort(function (a, b) {
        return a.id - b.id
    });

    //If the table already exists remove it
    if (!!table) {
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
        cell.innerHTML = "<b>" + camelCaseToString(key) + "</b>";
        head.appendChild(cell);
    }

    // Create table header cell for the selection boxes
    let headCell = document.createElement("th");
    headCell.innerHTML = "<b>Actions</b>";
    head.appendChild(headCell);

    //New record button creation and insertion
    let newBtn = document.createElement("button");
    headCell = document.createElement("th");
    newBtn.setAttribute("class", "btn btn-primary new-btn");
    newBtn.setAttribute("id", "new-btn");
    newBtn.innerHTML = "New Record";
    newBtn.setAttribute("data-toggle", "modal");
    newBtn.setAttribute("data-target", "#newRecord");
    newBtn.setAttribute("onclick", `${newFunc}()`);
    headCell.append(newBtn);
    head.append(headCell);

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

        //message is the name of the property in any response from the server that is a confirmation of success/error
        //if so the elements for editing/deleting do not need to be drawn.
        if (data.includes("message"))
            return;

        //edit button creation for each record
        let editBtn = document.createElement("button");
        editBtn.setAttribute("class", "btn btn-outline-info edit-btn");
        editBtn.setAttribute("id", element["id"]);
        editBtn.setAttribute("innerHTML", "[Edit]");
        editBtn.innerHTML = "Edit";

        //delete button creation for each cell
        let delBtn = document.createElement("button");
        delBtn.setAttribute("class", "btn btn-outline-info");
        delBtn.innerHTML = "Delete";

        //append the new buttons to the table cell
        cell.append(editBtn);
        cell.append(document.createTextNode(" "));//add a space between them
        cell.append(delBtn);
        cell.setAttribute("colspan", "2");//merge this column with the column created from the new record button

        //onclick attributes for edit and delete
        editBtn.setAttribute("onclick", `${upFunc}(${editBtn.parentElement.id});`);
        editBtn.setAttribute("data-toggle", "modal");
        editBtn.setAttribute("data-target", "#myModal");
        delBtn.setAttribute("onclick", `${delFunc}(${delBtn.parentElement.id})`);
    });
}