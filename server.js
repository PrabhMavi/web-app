/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Prabhjot Kaur Student ID: 148991219 Date: 
*
********************************************************************************/ 



var collegedata= require('./modules/collegeData')

// adding middlewares to the app
var express= require('express')
var multer=require('multer')
var path=require('path')    
var upload = multer();
var app= express()

// using array to append the JSON file
app.use(upload.array()); 

// Add middleware for static contents
app.use(express.static('views'))
app.use(express.static('modules'))


var HTTP_PORT = process.env.PORT || 8080;


//to be used when loading the form
app.use(express.urlencoded({ extended: true }));

app.get('/students', (req, res) => {

    if( req.query.course &&  req.query.course !== undefined){
        let courseParas = req.query.course;
        console.log(courseParas);

         collegedata.getStudentsByCourse(courseParas).then(course => {
                res.send(course)
            }).catch(err => {
                err = {
                message : "no results"}
            res.send()})
           
        }
        else {
            collegedata.getAllStudents().then(students => {
            res.send(students)
            }).catch(err => {
                err = {
                message : "no results"}
            res.send()
        })
    }
})

app.get("/tas", (req, res) => {
        collegedata.getTAs().then(tas => {
        res.send(tas)
        }).catch(err => {
        err = {
            message : "no results"}
        res.send()
    })
})


app.get("/courses", (req, res) => {
        collegedata.getCourses().then(courses => {
        res.send(courses)
        }).catch(err => {
        err = {
            message : "no results"}
        res.send()
    })
})


app.get("/student/:studentnum", (req, res) => {
    console.log("Entering student num")
    let studentnumber = req.params.studentnum
            collegedata.getStudentByNum(studentnumber).then(students => {
                res.send(students)
            }).catch(err => {
                console.log(err)
            })
           
        })

//get method to get the form for adding new student

app.get("/students/add",(req,res)=>
{
    res.sendFile(path.join(__dirname,"./views/addStudent.html"))
}) ;


//posting the message after adding the student
app.post("/students/add",(req,res)=>{
    console.log('student add called')
    console.log(JSON.stringify(req.body))
    res.send("Student added")
    collegedata.addStudent(JSON.stringify(req.body))
    res.end()
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/home.html"));
});

app.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,"./views/home.html"))
})

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/about.html"));
});

app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname,"./views/htmlDemo.html"));
});

app.get('*', function(req, res){
    res.send('Error: Page Not Found');
});

// setup http server to listen on HTTP_PORT
collegedata.initialize()
.then(app.listen(HTTP_PORT, ()=>{ 
    console.log("server listening on port: " + HTTP_PORT)
}))
.catch(err => {
    console.log("Error: Can't intialize the json files")
})


