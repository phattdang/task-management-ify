import { useState } from "react";
import authApi from "../api/authApi";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authApi.login({ username, password });
      console.log(res.data);
      localStorage.setItem("access_token", res.data.data.token);
      window.location.href = "/tasks";
    } catch (err) {
      console.error(err);
      setError("Sai username hoặc mật khẩu");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white dark:bg-slate-900/60 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800/50"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
        Đăng nhập
      </h2>
      <input
        type="text"
        placeholder="Username"
        className="w-full mb-3 p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        className="w-full mb-3 p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white py-2 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50 transition-colors"
      >
        Đăng nhập
      </button>
    </form>
  );
}
