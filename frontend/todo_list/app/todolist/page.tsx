"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Todo {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: "pending" | "open" | "overdue" | "complete";
}

export default function TodoList() {
  const router = useRouter();
  const API = "http://localhost:5000/api/todos";

  const [filter, setFilter] = useState("all");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTodos = async (status = "all") => {
    try {
      const res = await fetch(`${API}?status=${status}`, {
        credentials: "include",
      });
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching todos", error);
    }
  };

  useEffect(() => {
    fetchTodos(filter);
    const interval = setInterval(() => fetchTodos(filter), 60000);
    return () => clearInterval(interval);
  }, [filter]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    fetchTodos(newFilter);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    try {
      const body = { title, description, startDate, dueDate };
      if (editId) {
        await fetch(`${API}/${editId}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        setEditId(null);
      } else {
        await fetch(API, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      setTitle("");
      setDescription("");
      setStartDate("");
      setDueDate("");
      setShowForm(false);
      fetchTodos(filter);
    } catch (error) {
      console.log("Error saving todo", error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this todo?")) return;
    try {
      await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
      fetchTodos(filter);
    } catch (error) {
      console.log("Error deleting todo", error);
    }
  };

  const editTodo = (todo: Todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setStartDate(todo.startDate?.substring(0, 10));
    setDueDate(todo.dueDate?.substring(0, 10));
    setEditId(todo._id);
    setShowForm(true);

    window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
    
  };

  const logout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;
    try {
      await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/");
    } catch (error) {
      console.log("Error logging out", error);
    }
  };

  const markComplete = async (todo: Todo) => {
    try {
      await fetch(`${API}/complete/${todo._id}`, {
        method: "PUT",
        credentials: "include",
      });
      fetchTodos(filter);
    } catch (error) {
      console.log("Error marking complete", error);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-gray-400";
      case "open": return "text-blue-400";
      case "overdue": return "text-red-500";
      case "complete": return "text-green-400";
      default: return "text-white";
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-800 text-white p-6 md:fixed md:block h-full">
        <h1 className="text-xl font-bold mb-6">ToDoist</h1>
        <button
          onClick={() => handleFilterChange("all")} 
          className="mt-3 md:mt-6 block hover:text-gray-400">All</button>
        <button 
          onClick={() => handleFilterChange("complete")} 
          className="mt-3 md:mt-6 block hover:text-gray-400">Completed</button>
        <button 
          onClick={() => handleFilterChange("pending")} 
          className="mt-3 md:mt-6 block hover:text-gray-400">Pending</button>
        <button 
          onClick={() => handleFilterChange("open")} 
          className="mt-3 md:mt-6 block hover:text-gray-400">Open</button>
        <button 
          onClick={() => handleFilterChange("overdue")} 
          className="mt-3 md:mt-6 block hover:text-gray-400">Overdue</button>
        <button  
          onClick={logout} 
          className="mt-3 md:mt-6 block text-red-400">Log-Out</button>
      </div>

      {/* Main */}
      <div className="flex-1 p-4 md:p-6 bg-gray-900 min-h-screen text-white md:ml-64">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Create your ToDo</h1>
        <button
          onClick={() => { setEditId(null); setTitle(""); setDescription(""); setStartDate(""); setDueDate(""); setShowForm(true);  window.scrollTo({top: 0,behavior: "smooth"}); }}
          className="mb-4 border rounded-full px-4 py-2 hover:bg-white hover:text-black"
        >
          + Add Todo
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 max-w-md">
            <input 
              placeholder="Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} className="p-2 rounded text-white bg-gray-700 w-full" />
            <input 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} className="p-2 rounded text-white bg-gray-700 w-full" />
            <label>Start Date:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} className="p-2 rounded text-gray-400 bg-gray-700 w-full" />
            <label>Due Date:</label>
            <input
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} className="p-2 rounded text-gray-400 bg-gray-700 w-full" />
              
            <button type="submit" className="p-2 rounded">{editId ? "Update Todo" : "Save Todo"}</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 p-2 rounded">Cancel</button>
          </form>
        )}

        {todos.length === 0 ? (
          <p>No Todos Found</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 ">
            {todos.map((todo) => (
              <div key={todo._id} className="border p-4 rounded bg-gray-800 max-w-2xl">
                <h3 className="font-bold">{todo.title}</h3>
                <p className="text-gray-300 mb-3">{todo.description}</p>
                <small className="text-gray-400 mt-1">Start: {todo.startDate?.substring(0, 10)}</small><br/>
                <small className="text-gray-400 mt-1">Due: {todo.dueDate?.substring(0, 10)}</small>
                <div className="mt-3 flex flex-wrap gap-3">

                <span className={`px-3 py-1 rounded ${statusColor(todo.status)}`}>
                  {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                </span>

                  {todo.status !== "complete" && (
                    <button
                      onClick={() => markComplete(todo)}
                      className="px-3 py-1 rounded bg-green-600 text-white"
                    >
                    Complete
                    </button>
                  )}
                  {todo.status !== "complete" && (
                    <button onClick={() => editTodo(todo)} className="px-3 py-1 rounded">Edit</button>
                  )}

                  <button onClick={() => deleteTodo(todo._id)} className="text-red-500 px-3 py-1 rounded">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}