

 import express from "express"
import {createTodo,getTodos} from "@/src/controller/todo.controller"
import {deleteTodo,updateTodo} from "@/src/controller/todo.controller"


const router=express.Router()


router.get("/",getTodos)

router.post("/",createTodo)

router.put("/:id",updateTodo)

router.delete("/:id",deleteTodo)



export default router