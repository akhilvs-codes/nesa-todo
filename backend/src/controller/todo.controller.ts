import { Request, Response } from "express";
import Todo from "@/src/model/todoModel";


export const createTodo = async (req: Request, res: Response) => {
    try {

        const { title, description, status } = req.body
        const todo = await Todo.create({ title, description })

        const total = await Todo.countDocuments()
        const limit = 3
        const totalPages = Math.ceil(total / limit)

        res.status(200).json({ message: "success", data: { todo, totalPages } });


    } catch (err) {
        res.status(500).json({ mesage: "internal server error" })
    }
}



export const getTodos = async (req: Request, res: Response) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = 3;
        const skip = (page - 1) * limit;

        const todos = await Todo.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Todo.countDocuments();

        res.status(200).json({
            todos,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {

        res.status(500).json({ mesage: "internal server error" })
    }


};


export const updateTodo = async (req: Request, res: Response) => {
    try {


        const { title, description, status } = req.body
        const todoId = req.params.id
        console.log(todoId, title, description);

        const todo = await Todo.findByIdAndUpdate(todoId, { $set: { title, description, status } }, { new: true });

        console.log(todo);


        res.status(200).json({ message: "success", data: todo });
    } catch (err) {
        console.log(err);

        res.status(500).json({ mesage: "internal server error" })

    }
};



export const deleteTodo = async (req: Request, res: Response) => {
    try {


        await Todo.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {

        res.status(500).json({ mesage: "internal server error" })

    }
};