import { useEffect, useState } from "react";
import taskApi from "../api/taskApi";
import userApi from "../api/userApi";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState([]);

  const [newTask, setNewTask] = useState({
    taskName: "",
    assigneeId: "",
  });

  const loadTasks = () => {
    taskApi
      .findAllTask()
      .then((res) => {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setTasks(list);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmitNewTask = () => {
    taskApi
      .addTask(newTask)
      .then(() => {
        setCreating(false);
        setNewTask({ taskName: "", assigneeId: "" });
        loadTasks();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (creating) {
      userApi
        .findAllUser()
        .then((res) => {
          const list = Array.isArray(res.data.data) ? res.data.data : [];
          setUsers(list);
        })
        .catch((err) => console.error(err));
    }
  }, [creating]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Danh sách công việc</h1>

      <table>
        <thead>
          <tr>
            <th>Work</th>
            <th>Assignee</th>
            <th>Reporter</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.taskId}>
              <td>{task.taskName}</td>
              <td>{task.assignee?.username || ""}</td>
              <td>{task.assignor?.username || ""}</td>
              <td>{task.priority}</td>
              <td>{task.status}</td>
              <td>{task.createdAt}</td>
              <td>{task.updatedAt}</td>
            </tr>
          ))}

          {creating && (
            <tr className="bg-gray-100">
              <td>
                <input
                  className="border p-1"
                  value={newTask.taskName}
                  onChange={(e) =>
                    setNewTask({ ...newTask, taskName: e.target.value })
                  }
                  placeholder="Task name..."
                />
              </td>

              <td>
                <select
                  className="border p-1"
                  value={newTask.assigneeId}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assigneeId: e.target.value })
                  }
                >
                  <option value="">-- Chọn assignee --</option>
                  {users.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </td>

              <td colSpan="5">
                <button
                  onClick={handleSubmitNewTask}
                  className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={() => setCreating(true)}
        className="border px-3 py-1 mt-4"
      >
        Add Task
      </button>
    </div>
  );
}
