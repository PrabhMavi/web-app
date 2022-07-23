/*********************************************************************************
*  WEB700 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Prabhjot Kaur Student ID: 148991219 Date: 
*  Heroku link: https://dashboard.heroku.com/apps/hidden-cliffs-81948/deploy/heroku-git
********************************************************************************/ 



var collegedata= require('./modules/collegeData')

// adding middlewares to the app
var express= require('express')
var multer=require('multer')
const exphbs = require('express-handlebars');
var path=require('path')    
var upload = multer();
var app= express()

// using array to append the JSON file
app.use(upload.array()); 

// Add middleware for static contents
app.use(express.static('views'))
app.use(express.static('modules'))

app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');


var HTTP_PORT = process.env.PORT || 8080;


//to be used when loading the form
app.use(express.urlencoded({ extended: true }));

app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

//adding a helper
app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    ,
    
    equal: function (lvalue, rvalue, options) {
        if (arguments.length < 2 ){
            throw new Error("Handlebars Helper equal needs 2 parameters");
        }
        if (lvalue != rvalue) {
            return options.inverse(this);
        } else {
            return options.fn(this);
        }
    }
}
}));
app.get('/students', (req, res) => {

    if( req.query.course &&  req.query.course !== undefined){
        let courseParas = req.query.course;
        console.log(courseParas);

         collegedata.getStudentsByCourse(courseParas).then(course => {
                res.render('students',{
                    data: course,
                    layout: "main"
                })
                console.log("courses data retrieved")
            }).catch(err => {
                err = {
                message : "no results"}
                res.render("students", {message: "no results"})})
           
        }
        else {
            collegedata.getAllStudents().then(students => {
            // res.send(students)
            res.render("students", {
                data: students,
                layout: "main"});
            }).catch(err => {
                err = {
                message : "no results"}
            // res.send()
            res.render("students", {message: "no results"});
        })
    
}})

// app.get("/tas", (req, res) => {
//         collegedata.getTAs().then(tas => {
//         res.send(tas)
//         }).catch(err => {
//         err = {
//             message : "no results"}
//         res.send()
//     })
// })


app.get("/courses", (req, res) => {
    collegedata.getCourses().then(courses => {
    // res.send(courses)
    res.render('courses',{
        data: courses,
        layout: "main"
    })
    console.log("Get courses called successfully" )
    }).catch(err => {
    // err = {
    //     message : "no results"}
        res.render("courses", {message: "no results"})
})
})


app.get("/student/:studentnum", (req, res) => {
    console.log("Entering student num")
    let studentnumber = req.params.studentnum
            collegedata.getStudentByNum(studentnumber).then(student => {
                // res.send(students)
                console.log(student)
                res.render("student", { 
                
                data: student ,
                layout: "main"}); 
                console.log("Student found")
            }).catch(err => {
                console.log(err)
            })
           
        });

//get method to get the form for adding new student

app.get("/students/add",(req,res)=>
{
    // res.sendFile(path.join(__dirname,"./views/addStudent.html"))
    res.render('addStudent',{
        layout:"main"
    })
}) ;

app.get("/courses/:courseid",(req,res)=>{
    console.log("getting courses by id ")
    let coursenum=req.params.courseid
    console.log(coursenum)
        collegedata.getCourseById(coursenum).then(cours =>{
            console.log(cours)
            res.render('course',{
                data: cours,
                layout: 'main'
            })
        }).catch(err=>
            {
                res.render('courses',{message:err})
            })
}) 


//posting the message after adding the student
app.post("/students/add",(req,res)=>{
    console.log('student add called')
    collegedata.addStudent(req.body).then(()=>{
        res.redirect("/students")  
    }
    ).catch(err=>{
        res.send(err)
    })
});

app.post("/student/update",(req,res)=>{
    //calling /student/update
    console.log("calling student update")
    console.log(JSON.stringify(req.body))
    collegedata.updateStudent(req.body).then(()=>{
        
        res.redirect("/students")
    }).catch(err=>{
        res.send(err)
    })

})

app.get("/", (req, res) => {
    // res.sendFile(path.join(__dirname,"./views/home.html"));
    res.render('home', {
        // data: someData,
        layout: "main" // do not use the default Layout (main.hbs)
    });
});

app.get("/home", (req, res) => {
    // res.sendFile(path.join(__dirname,"./views/home.html"));
    res.render('home', {
        // data: someData,
        layout: "main" // do not use the default Layout (main.hbs)
    });
});

app.get("/about", (req, res) => {
    //res.sendFile(path.join(__dirname,"./views/about.html"));
    res.render('about',{
        layout:"main"
    })
});

app.get("/htmlDemo", (req, res) => {
    //res.sendFile(path.join(__dirname,"./views/htmlDemo.html"));
    res.render('htmlDemo',{
        layout:"main"
    })
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


