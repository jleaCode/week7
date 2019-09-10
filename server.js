let express = require('express')
const mongoose = require("mongoose");
let bodyParser = require('body-parser')
let ejs = require('ejs');
let app = express()

app.use(express.static("public"))
app.use(express.static("views"))
app.use(express.static("css"))

app.use(bodyParser.urlencoded({
    extended: false
}))


app.engine("html", ejs.renderFile);
app.set('view engine', "html");

let Developer = require('./models/developer');
let Task = require('./models/task');
let db = 'mongodb://localhost:27017/devTasks';

mongoose.connect(db, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
        throw err;
    }
    console.log('Successfully connected');
});

//home page
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

//add new Developer 
app.get('/addnewdev', function (req, res) {
    res.sendFile(__dirname + '/views/addNewDev.html');
});
app.post('/newdevdata', function (req, res) {
    let devDetails = req.body;
    let newDev = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: devDetails.firstName,
            lastName: devDetails.lastName,
        },
        level: devDetails.devLevel,
        address: {
            state: devDetails.addState,
            suburb: devDetails.addSuburb,
            street: devDetails.addStreet,
            unit: devDetails.addUnit,
        }
    });
    newDev.save(function (err) {
        if (err) throw err;
    });
    res.redirect('/listdev');
});
//list Developers
app.get('/listdev', function (req, res) {
    Developer.find({}, function (err, docs) {
        res.render('listDev', { devDb: docs });
    });
});

//add new task
app.get("/newtask", function (req, res) {
    res.sendFile(__dirname + "/views/newTask.html")
});

app.post('/addtask', function (req, res) {
    let task = req.body;
    let date = new Date(task.taskDue);

    let newTask = new Task({
        TaskID: new mongoose.Types.ObjectId(),
        taskName: task.taskName,
        taskAssign: task.taskAssign,
        taskDue: date,
        taskStatus: task.taskStatus,
        taskDesc: task.taskDesc
    });

    newTask.save(function (err) {
        if (err) {
            throw err;
        } else {
            console.log(newTask);
        }
        res.redirect('/listtask');
    });
});


//list task

app.get('/listtask', function (req, res) {
    Task.find({}, function (err, data) {
        res.render('listTask', { tasks: data });
    });
});



//update tasks
app.get('/updateTask', function (req, res) {
    res.sendFile(__dirname + '/views/updateTask.html');
});

app.post('/updateTask', function (req, res) {
    let id = new mongoose.Types.ObjectId(req.body.utaskid);
    console.log(id);
    Task.updateOne({ _id: id }, { $set: { taskStatus: req.body.taskStatus } }, () => {
        res.redirect('listTask');
    });
});

//delete task 
app.get('/deleteTask', function (req, res) {
    res.sendFile(__dirname + '/views/deleteTask.html');
});

app.post('/deletetask', function (req, res) {
    let id = req.body.TaskId;
    Task.deleteOne({ _id: id }, function (err, doc) {
        res.redirect("/listTask");
    });

    console.log("task ID == " + req.body.TaskId);
});

//delete all completed tasks
app.get('/deleteAll', function (req, res) {
    res.sendFile(__dirname + '/views/deleteAll.html');
});

app.post('/deleteAllTask', function (req, res) {
    if (req.body.selection === "true") {
        Task.deleteMany({ taskStatus: "Complete" }, function (err, doc) {
            res.redirect("/listTask");
        });

    }
    else {
        res.redirect("/");
    }
    console.log(req.body.selection);
});

//insert Many 
app.get("/insertMany", function (req, res) {
    res.sendFile(__dirname + "/views/insertMany.html")
});

app.post('/addMany', function (req, res) {
    let count = req.body.count
    let tasks = [];
    for (i = 0; i < count; i++) {
        tasks.push({
            TaskId: Math.round(Math.random() * 1000),
            TaskName: req.body.TaskName,
            TaskAssign: req.body.TaskAssign,
            TaskDue: req.body.TaskDue,
            TaskStatus: req.body.TaskStatus,
            TaskDesc: req.body.TaskDesc
        })
    }
    console.log(tasks);
    db.collection('tasklist').insertMany(tasks);
    res.redirect('/listTask');

})



app.listen(8080);