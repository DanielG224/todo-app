import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://localhost:5005/tasks";

  const fetchTasks = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  const toggleTask = async (task) => {
    await fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        completed: !task.completed,
      }),
    });

    fetchTasks();
  };

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="input-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dodaj nowe zadanie..."
        />
        <button onClick={addTask}>Dodaj</button>
      </div>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "done" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />

            <span>{task.title}</span>

            <button onClick={() => deleteTask(task._id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;