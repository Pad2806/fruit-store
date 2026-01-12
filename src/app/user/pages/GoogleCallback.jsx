import { useEffect } from "react";

export default function GoogleCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("access_token", token);
      // Force a full page reload to ensure authentication state is completely refreshed
      window.location.assign("/");
    }
  }, []);

  return <p>Đang đăng nhập bằng Google...</p>;
}
