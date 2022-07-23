const { json } = require("express");
const fs = require("fs");
const { resolve } = require("path");

class Data{
    constructor(students, courses){
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection= null

var initialize = function () {
    return new Promise( (resolve, reject) => {
        fs.readFile('./data/courses.json','utf8', (err, courseData) => {
            if (err) {
                reject("unable to load courses"); return;
            }

            fs.readFile('./data/students.json','utf8', (err, studentData) => {
                if (err) {
                    reject("unable to load students"); return;
                }

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve(dataCollection);
            });
        });
    });
}

var getAllStudents = function(){
    let data=null
    return new Promise((resolve,reject)=>{
        initialize().then(dataCollect=>{
            data=dataCollect
            //console.log(data)
            if (data.students.length == 0) {
                reject("query returned 0 results"); return;
        
        
        }

        resolve(dataCollect.students);
    })
})}

var getTAs = function () {
    let data =null
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];
        initialize().then(dataCollect=>{
            data=dataCollect
            //console.log(data)

        for (let i = 0; i < data.students.length; i++) {
            if (dataCollection.students[i].TA == true) {
                filteredStudents.push(data.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    })
    });
};

var getCourses = function(){
    let data=null
   return new Promise((resolve,reject)=>{
    initialize().then(dataCollect=>{
        data=dataCollect
        //console.log(data)
    if (data.courses.length == 0) {
        reject("query returned 0 results"); return;
    }

    resolve(dataCollect.courses);
   });
})
}

var getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) {
        var foundStudent = null;
        initialize().then(dataCollection=>{
            //data=dataCollection
            //console.log(data)

        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].studentNum == num) {
                foundStudent = dataCollection.students[i];
            }
        }

        if (!foundStudent) {
            reject("query returned 0 results"); return;
        }

        resolve(foundStudent);
    })
    });
};

var getCourseById= function(id){
    console.log(id+'here1')
    return new Promise(function(resolve, reject){
        var getcourse=null;
        console.log(id+'here2')
        initialize().then(datacollect=>{
            console.log(id+ ' here 3')
            for (let i=0; i < datacollect.courses.length; i++){
                
                if (datacollect.courses[i].courseId==id){
                    console.log(id)
                    getcourse= datacollect.courses[i];
                }
                
            }

            if (!getcourse){
                reject("query returned 0 results "); return;

            }
            resolve(getcourse);

        })
    })
}

var getStudentsByCourse = function (course) {
    return new Promise(function (resolve, reject) {
        var filteredStudents = [];
        initialize().then(dataCollection=>{
            //data=dataCollection
            //console.log(data)
        for (let i = 0; i < dataCollection.students.length; i++) {
            if (dataCollection.students[i].course == course) {
                filteredStudents.push(dataCollection.students[i]);
            }
        }

        if (filteredStudents.length == 0) {
            reject("query returned 0 results"); return;
        }

        resolve(filteredStudents);
    })
    });
};


var addStudent=function(studentData){
    return new Promise ((resolve,reject)=>{
        let stunum=null;
        let str={}
        console.log("adding student")
        console.log(studentData)
        str=studentData
        console.log(str)
        if (studentData.TA !=true){
            studentData.TA=false
        }

        getAllStudents().then(studata=>{
            // console.log(studata.length)
            stunum=studata.length+1
            str = Object.assign({studentNum:stunum},str)
            console.log(str)
        }).catch(err=>{
            console.log("error occured getting students"+err)})

        initialize().then(dataCollection=>{
           console.log('the length of the list is '+ dataCollection.students.length)
           dataCollection.students.push(str)
           console.log(JSON.stringify(str))
           console.log('the length of the updated list is '+ dataCollection.students.length)
           try {
                fs.writeFileSync('./data/students.json', JSON.stringify(dataCollection.students));
                console.log("JSON data is saved.");
            } catch (error) {
                console.log(error);
            }
        })
               
        resolve("created data")    

    })
};

var updateStudent=function(studentData){
    return new Promise ((resolve,reject)=>{
    
        var cnt =0
        initialize().then(data=>{
            for (let i=0; i<data.students.length ; i++){
                if (data.students[i].studentNum==studentData.studentNum){
                    cnt=cnt+1
                    data.students[i].firstName=studentData.firstName
                    data.students[i].lastName=studentData.lastName
                    data.students[i].email=studentData.email
                    data.students[i].addressStreet=studentData.addressStreet
                    data.students[i].addressCity=studentData.addressStreet
                    data.students[i].addressStreet=studentData.addressStreet
                    data.students[i].addressProvince=studentData.addressProvince
                    data.students[i].TA=studentData.TA
                    data.students[i].status=studentData.status
                    data.students[i].course=studentData.course
                    console.log(data.students[i])
                    try {
                        fs.writeFileSync('./data/students.json', JSON.stringify(dataCollection.students));
                        console.log("JSON data is saved.");
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
            if (cnt>0){
                resolve(console.log("done with the update"))
            }
            else{
                reject("no student found with the student num")
            }
            
        })

    })
}

module.exports={initialize,getAllStudents,getTAs,getCourses,getStudentByNum,getStudentsByCourse,addStudent,getCourseById,updateStudent}

 