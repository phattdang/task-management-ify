import { useEffect, useState } from "react";
import axiosClient from "../../../utils/axiosClient";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/task-management/api/v2/tasks")
      .then((res) => {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        console.log(list);
        setTasks(list);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Danh sách công việc</h1>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.taskId}
            className="p-3 border rounded-lg bg-white shadow-sm"
          >
            {task.taskName}
          </li>
        ))}
      </ul>
    </div>
  );
}
