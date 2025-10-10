import { io } from "socket.io-client";
import { getAuthToken, getApiBase } from "./api";

let socket = null;

export function initSocket() {
  const token = getAuthToken();
  const base = getApiBase();
  const url = base.replace(/\/$/, "");

  // If socket exists but token changed (e.g. user logged in after initial load), reconnect
  if (socket) {
    try {
      const existingToken = socket.auth && socket.auth.token;
      if (existingToken !== token) {
        console.log("[SOCKET] auth token changed, reconnecting socket");
        socket.disconnect();
        socket = null;
      } else {
        return socket;
      }
    } catch (e) {
      console.warn("[SOCKET] Failed to compare token", e);
      try {
        socket.disconnect();
      } catch (err) {
        console.warn("[SOCKET] failed to disconnect", err);
      }
      socket = null;
    }
  }

  console.log("[SOCKET] connecting to", url, "with token present?", !!token);
  socket = io(url, { auth: { token }, autoConnect: true });

  socket.on("connect", () => {
    console.log("[SOCKET] connected", socket.id);
  });
  socket.on("connect_error", (err) => {
    console.warn("[SOCKET] connect_error", err && err.message);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
