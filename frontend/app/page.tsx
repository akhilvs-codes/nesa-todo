"use client";

import { useEffect, useState } from "react";
import { Todo, getTodos, createTodo, deleteTodo, updateTodo } from "@/services/todo.services";
import toast from "react-hot-toast";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(3);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchTodos = async (p: number) => {
    setLoading(true);
    const data = await getTodos(p);
    setTodos(data.todos);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos(page);
  }, [page]);


  const handleCreate = async () => {

    if (!title.trim()) {
      toast.error("please fill title");
      return;
    }

    const res = await createTodo(title, desc)
    const newTodo = res.data.todo;

    setTodos(prev => {
      const updated = [newTodo, ...prev];
      if (updated.length > limit) updated.pop()
      return updated;
    });

    setTotalPages(res.data.totalPages);
    setTitle("");
    setDesc("");
    toast.success("Task added");

  };


  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    // setTodos(prev => prev.filter(t => t._id !== id))
    fetchTodos(page)
    toast.success("task deleted");

  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDesc(todo.description || "");
  };

  const saveEdit = async (id: string) => {
    const res = await updateTodo(id, {
      title: editTitle,
      description: editDesc,
    });

    console.log(res.data);

    setTodos(prev =>
      prev.map(t =>
        t._id === id ? { ...t, ...res.data } : t
      )
    );

    setEditingId(null);
  };


  const handleStatusChange = async (
    id: string,
    status: Todo["status"]
  ) => {
    await updateTodo(id, { status });

    setTodos(prev =>
      prev.map(t =>
        t._id === id ? { ...t, status } : t
      )
    );
  };



  return (
    <main className="min-h-screen bg-gray-900 flex justify-center py-10">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6">

        <h1 className="text-2xl font-bold text-center mb-6 text-white">
          Todo App
        </h1>

        <div className="space-y-3 mb-6">
          <input
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Description"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <button
            onClick={handleCreate}
            className="w-full bg-blue-500 py-2 rounded"
          >
            Add Task
          </button>
        </div>

        <div className="space-y-4">
          {todos.map(todo => (
            <div key={todo._id} className="bg-gray-600 p-4 rounded">

              {editingId === todo._id ? (
                <>
                  <input
                    className="w-full border p-1 mb-2"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                  <input
                    className="w-full border p-1 mb-2"
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                  />
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="bg-green-500 text-white px-2 py-1 mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-2 py-1"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-bold">{todo.title}</h3>
                  <p>{todo.description}</p>

                  <div className="flex justify-between mt-2">
                    <select
                      value={todo.status}
                      onChange={e =>
                        handleStatusChange(
                          todo._id,
                          e.target.value as Todo["status"]
                        )
                      }
                      className="border"
                    >
                      <option>Pending</option>
                      <option>In-Progress</option>
                      <option>Completed</option>
                    </select>

                    <div className="space-x-2">
                      <button
                        onClick={() => startEdit(todo)}
                        className="bg-yellow-500 px-2 py-1 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="bg-red-500 px-2 py-1 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white 
               hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed "
          >
            Prev
          </button>

          <span className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white 
               hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>

        </div>
      </div>
    </main>
  )
}