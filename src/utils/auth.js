import { jwtDecode } from "jwt-decode";

export function getUserInfo() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return jwtDecode(token); // returns { username, role, exp, etc. }
  } catch {
    return null;
  }
}
