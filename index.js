const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}


function GetTodos(files) {
    const todos = [];
    for (const file of files) {
        for (const line of file.split('\r\n')) {
            if (line.includes('// TODO')) {
                todos.push(line.substr(line.indexOf('// TODO')));
            }
        }
    }

    return todos;
}

function PrintArray(arr) {
    for (const arrElement of arr) {
        console.log(arrElement);
    }
}

function FindImportantTodos() {
    const todos = GetTodos(files);
    const arr = [];
    for (const todo of todos) {
        if (todo.includes('!')) {
            arr.push(todo);
        }
    }
    return arr;
}

function GetTodosByUser(username) {
    const todos = GetTodos(files);
    const res = []

    for (const todo of todos) {
        const strArr = todo.split(';')[0].split(' ');
        const name = strArr[strArr.length - 1];
        if (name === username) {
            res.push(todo);
        }
    }
    return res;
}


function GetSortedTodosByImportance() {
    const importantTodos = FindImportantTodos();
    importantTodos.sort((a, b) => b.split('!').length - a.split('!').length);

    return importantTodos;
}

function GetGroupedUsers(){
    const todos = GetTodos(files);
    const dict = {};
    for (const todo of todos) {
        let user = todo.split(';')[0].substr(8);
        if (!todo.includes(';'))
        {
            if (!("" in dict))
                dict[""] = [];
            dict[""].push(todo);
        }
        else{
            if (!(user in dict))
                dict[user] = [];
            dict[user].push(todo);
        }
    }

    return dict;
}

function PrintDict(dict){
    for (const key in dict) {
        console.log(key + ':');
        for (const todo of dict[key]) {
            console.log(todo);
        }
    }
}

function processCommand(command) {

    const parts = command.split(' ');
    let username = '';
    if (parts[0] === 'user' && parts.length === 2) {
        username = parts[1];
    }

    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            PrintArray(GetTodos(files));
            break;
        case 'important':
            PrintArray(FindImportantTodos());
            break;
        case `user ${username}`:
            PrintArray(GetTodosByUser(username));
            break;
        case 'sort importance':
            PrintArray(GetSortedTodosByImportance());
            break;
        case 'sort user':
            PrintDict(GetGroupedUsers());
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
