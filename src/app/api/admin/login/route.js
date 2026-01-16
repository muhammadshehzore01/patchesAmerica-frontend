// D:\learning\projects\patchesAmerica\frontend\src\app\api\admin\login\route.js
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const { username, password } = await req.json();

    // Environment-aware API base
    const apiBase =
      process.env.DOCKER_ENV === "true"
        ? process.env.DOCKER_INTERNAL_API_BASE // SSR / Docker internal
        : process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

    // Remove extra /api if present
    const loginUrl = `${apiBase.replace(/\/$/, "")}/admin-token/`;

    console.log("🔍 Login URL:", loginUrl);

    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Raw response from Django:", text);
      return NextResponse.json(
        { success: false, error: "Unexpected response from Django" },
        { status: 500 }
      );
    }

    if (res.ok && data.token) {
      return NextResponse.json({
        success: true,
        token: data.token,
        redirect: "/admin-chat/chat",
      });
    } else {
      return NextResponse.json(
        { success: false, error: data.detail || "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Operation failed" },
      { status: 500 }
    );
  }
};
