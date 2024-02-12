const express = require("express");
const todosRoutes = express.Router();
const {PrismaClient} = require("@prisma/client");
const allTodos = [{nome: "aaaa", status: false}];
todosRoutes.post();

const prisma = new PrismaClient();

// C
todosRoutes.post("/todos", async (request, response) => {
	const { name } = request.body;
	const todo = await prisma.todo.create({
		data: {
			name,
		}
	}) 
	allTodos.push({name, status: false})
	return response.status(201).json(allTodos)
})
// R
todosRoutes.get("/todos", async (request, response) => {
	const todos = await prisma.todo.findMany();
	return response.status(200).json(todo);
})
// U
todosRoutes.put("/todos", async (request, response) => {
	const {name, id, status} = request.body;

	if (!id) {
		return response.status(400).json("O id é obrigatório.")
	}

	const todoAlreadyExist = await prisma.todo.findUnique({
		where: {
			id
		}
	})

	if (!todoAlreadyExist) {
		return response.status(404).json("A todo não existe.")
	}

	const todo = await prisma.todo.update({
		where: {
			id,
		},
		data: {
			name,
			status
		}
	})

	return response.status(200).json(todo);
})
// D
todo

module.exports = todosRoutes;

