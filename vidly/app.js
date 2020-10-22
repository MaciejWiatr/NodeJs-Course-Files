const express = require("express");
const app = express();
require("dotenv").config();
const Joi = require("joi");

app.use(express.json());

const genres = [
    {
        id: 1,
        name: "Horror",
    },
    {
        id: 2,
        name: "Adventure",
    },
    {
        id: 3,
        name: "Document",
    },
];

const validateGenreSchema = (reqBody) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });
    const { error: err } = schema.validate(reqBody);
    return {
        isValid: err ? false : true,
        errorMsg: err ? err.details[0].message : null,
        body: reqBody,
    };
};

const getGenreById = (id) => genres.find((g) => g.id === parseInt(id));

app.get("/genres/", (req, res) => {
    res.send(genres);
});

app.get("/genres/:id", (req, res) => {
    const { id } = req.params;
    const genre = getGenreById(id);
    if (!genre) return res.status(404).send("Genre not find");

    res.send(genre);
});

app.post("/genres/", (req, res) => {
    const { isValid, errorMsg } = validateGenreSchema(req.body);
    if (!isValid) {
        res.send(400).send(errorMsg);
        return;
    }
    const genre = {
        id: genres.length + 1,
        name: req.body.name,
    };
    genres.push(genre);
    res.send(genre);
});
app.put("/genres/:id", (req, res) => {
    const { id } = req.params;
    const genre = getGenreById(id);
    if (!genre) return res.status(404).send("Genre not find");
    const { isValid, errorMsg } = validateGenreSchema(req.body);
    if (!isValid) {
        res.send(400).send(errorMsg);
        return;
    }
    genre.name = req.body.name;
    res.send(genre);
});
app.delete("/genres/:id", (req, res) => {
    const { id } = req.params;
    const genre = getGenreById(id);
    if (!genre) return res.status(404).send("Genre not find");
    const genreIndex = genres.indexOf(genre);
    genres.splice(genreIndex, 1);
    res.send(genre);
});

app.listen(process.env.PORT, () => console.log("Listening on port 3000"));
