

 import express from "express"
import {createTodo,getTodos} from "@/src/controller/todo.controller"
import {deleteTodo,updateTodo} from "@/src/controller/todo.controller"


const router=express.Router()


router.get("/",getTodos)

router.post("/",createTodo)

router.patch("/",updateTodo)

router.delete("/",deleteTodo)



export default router