const isLocal = ["localhost", "127.0.0.1"].includes(
  window.location.hostname
);

export const API_URL = isLocal
  ? "http://127.0.0.1:8000"
  : "https://speedcube-api.vercel.app";