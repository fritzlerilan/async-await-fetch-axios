import http from "http";
import express from "express";
import axios from "axios";
import fetch from "node-fetch";

// Constantes
const PORT = 3000;
const TODOS_URI = "https://jsonplaceholder.typicode.com/todos";
const USERS_URI = "https://jsonplaceholder.typicode.com/users";

const app = express();
app.use(express.json());

app.get("/:id", (req, res) => {
    const { id } = req.params;

    fetch(`${TODOS_URI}/${id}`)
        .then((response) => response.json())
        .then((todo) => {
            const { userId, title } = todo;

            fetch(`${USERS_URI}/${userId}`)
                .then((response) => response.json())
                .then((user) => {
                    const { username, email } = user;
                    res.json({
                        post_id: id,
                        title,
                        user_id: userId,
                        username,
                        email,
                    });
                });
        });
});

app.get("/async/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const responseTodo = await fetch(`${TODOS_URI}/${id}`);
        const todo = await responseTodo.json();

        const { userId, title } = todo;

        const responseUser = await fetch(`${USERS_URI}/${userId}`);
        const user = await responseUser.json();

        const { username, email } = user;

        res.json({
            id,
            title,
            user_id: userId,
            username,
            email,
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/axios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const responseTodo = await axios.get(`${TODOS_URI}/${id}`);
        const responseUser = await axios.get(`${USERS_URI}/${responseTodo.data.userId}`);
        
        const { userId, title } = responseTodo.data;
        const { username, email } = responseUser.data;

        res.json({
            id,
            title,
            user_id: userId,
            username,
            email,
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
