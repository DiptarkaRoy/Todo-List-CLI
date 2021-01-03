const process = require('process');
var args = process.argv.slice(2);
var fs = require('fs');
const helpString = require("./hlpString");
var DATABASE_PATH = "./todo.txt";

function init() {
    // We will make a database file in *.JSON format to keep our todos

    // if file doesnt exist we will create one 
    if (!fs.existsSync(DATABASE_PATH)) {
        console.log("Initialising storage.\n Creating `todo.txt` file");
        setData([]);
    }
}

// we will read files using this function
function getData() {
    //read file contents
    var contents = fs.readFileSync(DATABASE_PATH);

    //parse contents
    var data = JSON.parse(contents);

    return data;
}

// we will write files using this function
function setData(data) {
    //strigify JSON
    var dataString = JSON.stringify(data);

    //write to  file
    fs.writeFileSync(DATABASE_PATH, dataString);
}

function add(args) {
    if (args === undefined) {
        console.log("Error: Missing todo string. Nothing added!");
    } else {
        //get data
        var data = getData();

        //add item
        data.push({ task: args, completed: false });

        //set data
        setData(data);

        args = JSON.stringify(args);
        console.log(`Added todo: ${args}`);
    }
}
function list(args) {
    if (args === undefined) {
        //get data
        var data = getData();

        for (var i = 0; i < data.length; i++) {
            if (data[i].completed == true) {
                data.splice(i, 1);
                i--;
            }
        }
        if (data == 0) {
            console.log("There are no pending todos!");
        }
        else {
            var count = 0;
            data = data.reverse();
            data.forEach((item, index) => {
                console.log(`[${data.length - index}] ${item.task}`);
            });
        }
    } else {
        console.log("Too many arguments!!!");
    }
}
function del(args) {
    if (args === undefined) {
        console.log("Error: Missing NUMBER for deleting todo.");
    } else {
        //get data
        var data = getData();

        //delete item
        if (args > 0 && args <= data.length) {
            data.splice(args - 1, args);

            //set data
            setData(data);
            console.log(`Deleted todo #${args}`);
        } else {
            console.log(`Error: todo #${args} does not exist. Nothing deleted.`)
        }
    }
}
function done(args) {
    if (args === undefined) {
        console.log("Error: Missing NUMBER for marking todo as done.");
    } else {
        //get data
        var data = getData();

        //modify the data (toggle)
        // if (args > 0 && args <= data.length) {
        if (data[args - 1] !== undefined) {
            data[args - 1].completed = !data[args - 1].completed;

            setData(data);
            if (data[args - 1].completed) {
                console.log(`Marked todo #${args} as done.`);

            } else {
                console.log(`Marked todo #${args} as undone`);
            }
        } else {
            console.log(`Error: todo #${args} does not exist.`);
        }

    }
}
function help(args) {
    if (args === undefined) {
        console.log(helpString);
    } else {
        console.log("Too many arguments!!!");
    }
}
function report(args) {
    if (args === undefined) {

        // finding date
        var date = new Date();

        // setting date as string containing date 
        date = `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        // finding number of completed or pending tasks
        var data = getData();
        var complete = 0;
        var incomplete = 0;

        data.forEach(item => {
            if (item.completed === true) {
                complete++;
            } else if (item.completed === false) {
                incomplete++;
            }
        });
        console.log(date, `Pending : ${incomplete} Completed : ${complete}`);

    } else {
        console.log("Too many arguments!!!");
    }
}

init();
switch (args[0]) {
    case "add":
        add(args[1]);
        break;
    case "ls":
        list(args[1]);
        break;
    case "del":
        del(args[1]);
        break;
    case "done":
        done(args[1]);
        break;
    case "report":
        report(args[1]);
        break;
    case undefined:
        help(args[1]);
        break;
    default:
        help(args[1]);
        break;
}