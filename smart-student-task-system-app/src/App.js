import React, { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setError("");
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        course,
        priority,
        status: "Pending",
      });

      setTitle("");
      setCourse("");
      setPriority("Medium");
      loadTasks();
    } catch (err) {
      setError(err.message || "Could not add task");
    }
  }

  async function handleToggle(task) {
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await updateTask(task._id, { status: newStatus });
      loadTasks();
    } catch (err) {
      setError(err.message || "Could not update task");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      setError(err.message || "Could not delete task");
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Smart Student Task System</h1>
      <p style={{ marginTop: -10, color: "#555" }}>
        Coming soon: AI-powered task suggestions, calendar sync, and more! Stay tuned.
      </p>

      {/* TASK FORM UI */}
      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Add a Task</h2>

        <form onSubmit={handleAdd} style={{ display: "grid", gap: 10 }}>
          <input
            placeholder="Task title (required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ padding: 10 }}
          />

          <input
            placeholder="Course (optional)"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            style={{ padding: 10 }}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: 10 }}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <button type="submit" style={{ padding: 10, cursor: "pointer" }}>
            Add Task
          </button>
        </form>

        {error && (
          <p style={{ marginTop: 12, color: "crimson" }}>
            Error: {error}
          </p>
        )}
      </div>

      {/* TASK LIST UI */}
      <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Task List</h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Add one above.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasks.map((t) => (
              <li
                key={t._id}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  border: "1px solid #eee",
                  borderRadius: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {t.title}{" "}
                      <span style={{ fontWeight: "normal", color: "#666" }}>
                        ({t.status})
                      </span>
                    </div>

                    <div style={{ color: "#555", marginTop: 4 }}>
                      Course: {t.course || "—"} | Priority: {t.priority}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleToggle(t)} style={{ cursor: "pointer" }}>
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p style={{ marginTop: 20, color: "#777", fontSize: 12 }}>
        ©2026.
      </p>
    </div>
  );
}
