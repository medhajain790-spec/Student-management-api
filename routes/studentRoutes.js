const express = require("express");
const router = express.Router();
const students = require("../data/students");

function getNextId() {
  return students.length > 0
    ? Math.max(...students.map((s) => s.id)) + 1
    : 1;
}

router.get("/", (req, res) => {
  res.status(200).json(students);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  res.status(200).json(student);
});

router.post("/", (req, res) => {
  const { name, course } = req.body;

  if (!name || !course) {
    return res
      .status(400)
      .json({ error: "Both 'name' and 'course' are required" });
  }

  const newStudent = {
    id: getNextId(),
    name,
    course,
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const { name, course } = req.body;

  if (!name && !course) {
    return res
      .status(400)
      .json({ error: "Provide at least 'name' or 'course' to update" });
  }

  if (name) student.name = name;
  if (course) student.course = course;

  res.status(200).json(student);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid student id" });
  }

  const index = students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const [deleted] = students.splice(index, 1);
  res.status(200).json({ message: "Student deleted", student: deleted });
});

module.exports = router;
