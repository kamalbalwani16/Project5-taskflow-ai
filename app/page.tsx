"use client";

import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: string | null;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("MEDIUM");
  const [editDueDate, setEditDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  async function loadTasks() {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();

      if (response.ok) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleAddTask() {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      setAdding(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          dueDate: dueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create task.");
        return;
      }

      setTasks((currentTasks) => [data, ...currentTasks]);

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setDueDate("");
      setAiResult("");
    } catch (error) {
      console.error("Failed to create task:", error);
      alert("Something went wrong while creating the task.");
    } finally {
      setAdding(false);
    }
  }

  function handleStartEdit(task: Task) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditPriority(task.priority);

    if (task.dueDate) {
      setEditDueDate(task.dueDate.slice(0, 10));
    } else {
      setEditDueDate("");
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("MEDIUM");
    setEditDueDate("");
  }

  async function handleSaveEdit(id: string) {
    if (!editTitle.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title: editTitle,
          description: editDescription,
          priority: editPriority,
          dueDate: editDueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update task.");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id ? data : task
        )
      );

      setAiResult("");
      handleCancelEdit();
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Something went wrong while updating the task.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCompleteTask(task: Task) {
    try {
      const newStatus =
        task.status === "DONE" ? "TODO" : "DONE";

      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: task.id,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update task.");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? data : currentTask
        )
      );

      setAiResult("");
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Something went wrong while updating the task.");
    }
  }

  async function handleDeleteTask(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/tasks?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to delete task.");
        return;
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );

      setAiResult("");
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Something went wrong while deleting the task.");
    }
  }

  async function handleAIAnalysis() {
    if (tasks.length === 0) {
      alert(
        "Please add at least one task before using AI analysis."
      );
      return;
    }

    try {
      setAiLoading(true);
      setAiResult("");

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.error || "Failed to generate AI analysis."
        );
        return;
      }

      setAiResult(data.result);
    } catch (error) {
      console.error("AI analysis failed:", error);
      alert(
        "Something went wrong while generating AI analysis."
      );
    } finally {
      setAiLoading(false);
    }
  }

  function formatDueDate(date: string | null) {
    if (!date) {
      return null;
    }

    const [year, month, day] = date
      .slice(0, 10)
      .split("-");

    return `${day}/${month}/${year}`;
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "TODO") {
        return task.status === "TODO";
      }

      if (filter === "DONE") {
        return task.status === "DONE";
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "OLDEST") {
        return a.id.localeCompare(b.id);
      }

      if (sortBy === "PRIORITY") {
        const priorityOrder: Record<string, number> = {
          HIGH: 1,
          MEDIUM: 2,
          LOW: 3,
        };

        return (
          (priorityOrder[a.priority] || 99) -
          (priorityOrder[b.priority] || 99)
        );
      }

      if (sortBy === "DUE_DATE") {
        if (!a.dueDate) {
          return 1;
        }

        if (!b.dueDate) {
          return -1;
        }

        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      }

      return b.id.localeCompare(a.id);
    });

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            TaskFlow AI
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your tasks intelligently.
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">
            Create a New Task
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border p-3"
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="rounded-lg border p-3"
            >
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
              <option value="HIGH">HIGH</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-lg border p-3"
            />
          </div>

          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4 w-full rounded-lg border p-3"
            rows={3}
          />

          <button
            onClick={handleAddTask}
            disabled={adding}
            className="mt-4 rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add Task"}
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                🤖 AI Productivity Assistant
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Let Gemini analyze your tasks and suggest a
                better plan.
              </p>
            </div>

            <button
              onClick={handleAIAnalysis}
              disabled={aiLoading || tasks.length === 0}
              className="rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {aiLoading
                ? "Analyzing..."
                : "✨ Analyze My Tasks"}
            </button>
          </div>

          {aiResult && (
            <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-5">
              <h3 className="mb-3 font-semibold text-purple-900">
                AI Productivity Analysis
              </h3>

              <div className="whitespace-pre-wrap text-gray-800">
                {aiResult}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              Your Tasks
            </h2>

            <div className="flex flex-wrap gap-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border p-2"
              >
                <option value="ALL">All Tasks</option>
                <option value="TODO">Todo</option>
                <option value="DONE">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border p-2"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="PRIORITY">Priority</option>
                <option value="DUE_DATE">Due Date</option>
              </select>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500">
              Loading tasks...
            </p>
          ) : filteredTasks.length === 0 ? (
            <p className="text-gray-500">
              No tasks found.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-lg border p-4"
                >
                  {editingId === task.id ? (
                    <div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(e.target.value)
                          }
                          className="rounded-lg border p-3"
                        />

                        <select
                          value={editPriority}
                          onChange={(e) =>
                            setEditPriority(e.target.value)
                          }
                          className="rounded-lg border p-3"
                        >
                          <option value="MEDIUM">
                            MEDIUM
                          </option>
                          <option value="LOW">LOW</option>
                          <option value="HIGH">HIGH</option>
                        </select>

                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) =>
                            setEditDueDate(e.target.value)
                          }
                          className="rounded-lg border p-3"
                        />
                      </div>

                      <textarea
                        value={editDescription}
                        onChange={(e) =>
                          setEditDescription(e.target.value)
                        }
                        className="mt-4 w-full rounded-lg border p-3"
                        rows={3}
                      />

                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() =>
                            handleSaveEdit(task.id)
                          }
                          disabled={saving}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {saving
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          onClick={handleCancelEdit}
                          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h3
                          className={`font-semibold ${
                            task.status === "DONE"
                              ? "text-gray-400 line-through"
                              : ""
                          }`}
                        >
                          {task.title}
                        </h3>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-2 text-gray-600">
                          {task.description}
                        </p>
                      )}

                      <p className="mt-2 text-sm text-gray-500">
                        Status: {task.status}
                      </p>

                      {task.dueDate && (
                        <p className="mt-1 text-sm text-gray-500">
                          Due: {formatDueDate(task.dueDate)}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            handleCompleteTask(task)
                          }
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                          {task.status === "DONE"
                            ? "Mark as Todo"
                            : "Complete"}
                        </button>

                        <button
                          onClick={() =>
                            handleStartEdit(task)
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteTask(task.id)
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}