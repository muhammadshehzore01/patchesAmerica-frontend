// frontend\src\app\admin\login\page.jsx
"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        window.location.href = data.redirect;
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form action="#" method="POST" onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg w-80">

        <h2 className="text-xl font-bold mb-4 text-white text-center">
          Admin Login
        </h2>
        <input
          name="username"
          type="text"
          placeholder="Username"
          className="w-full p-2 rounded mb-4 bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded mb-4 bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
        />
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
