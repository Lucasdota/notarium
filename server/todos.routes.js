const express = require("express");
const todosRoutes = express.Router();

const allTodos = [{nome: "aaaa", status: false}];
todosRoutes.post();


// C
todosRoutes.post("/todos", (request, response) => {
	const { name } = request.body
	allTodos.push({name, status: false})
	return response.status(201).json(allTodos)
})
// R
todosRoutes.get("/todos", (request, response) => {
	return response.status(200).json(allTodos);
})
// U
// D

module.exports = todosRoutes;

