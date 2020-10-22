const express = require("express");
const app = express();
const Joi = require("joi");

app.use(express.json());
require("dotenv").config();

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
    const { imie, nazwisko } = req.query;

    res.send(
        JSON.stringify({
            message: `Hello ${imie} ${nazwisko}`,
        })
    );
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    const course = courses.find((c) => c.id === parseInt(id));
    if (!course) return res.status(400).send("Course not found");

    res.send(course);
});

app.post("/api/courses/", (req, res) => {
    const { error: validationError } = validateCourse(req.body);

    if (validationError)
        return res.status(400).send(validationError.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };
    courses.push(course);
    res.status(201).send(course);
});

app.put("/api/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(400).send("Course not found");
    const { error: validationError } = validateCourse(req.body);

    if (validationError)
        return res.status(400).send(validationError.details[0].message);

    course.name = req.body.name;
    res.status(201).send(course);
});

app.delete("/api/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("Course not found");
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.send(course);
});

const port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    return schema.validate(course);
}
