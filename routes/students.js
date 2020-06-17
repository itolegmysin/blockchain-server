const mongoose = require("mongoose");
const express = require("express");
const jsonParser = express.json();
const studentScheme = require("../schemas/student");
const Student = mongoose.model("Student", studentScheme);

module.exports = (app) => {
  app.get("/api/students", function (req, res) {
    Student.find({}, function (err, students) {
      if (err) return console.log(err);
      res.send(students)
    });
  });

  app.get("/api/students/:id", function (req, res) {

    const id = req.params.id;
    Student.findOne({ _id: id }, function (err, student) {

      if (err) return console.log(err);
      res.send(student);
    });
  });

  app.post("/api/students", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const { course, name, speciality } = req.body;
    const student = new Student({ name, course, speciality });

    student.save(function (err) {
      if (err) return console.log(err);
      res.send(student);
    });
  });

  app.delete("/api/students/:id", function (req, res) {

    const id = req.params.id;
    Student.findByIdAndDelete(id, function (err, student) {

      if (err) return console.log(err);
      res.send(student);
    });
  });

  app.put("/api/students", jsonParser, function (req, res) {

    if (!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const { course, name, speciality } = req.body;
    const student = new Student({ name, course, speciality });

    Student.findOneAndUpdate({ _id: id }, student, { new: true }, function (err, user) {
      if (err) return console.log(err);
      res.send(user);
    });
  });

  return app;
}
