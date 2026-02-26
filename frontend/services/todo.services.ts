

import { api } from "@/lib/api";

export interface Todo {
    _id: string; title: string; description?: string;
    status: "Pending" | "In-Progress" | "Completed";
}

export const getTodos = async (page: number) => {
    const res = await api.get(`/todos?page=${page}`)
    return res.data;
};

export const createTodo = async (title: string, description: string) => {
    const res = await api.post("/todos", { title, description })
    return res.data;
};

export const deleteTodo = async (id: string) => {
    await api.delete(`/todos/${id}`)
};

export const updateTodo = async (
    id: string, { status, title, description }: any
) => {
    const res = await api.put(`/todos/${id}`, { title, description, status })

    return res.data
};