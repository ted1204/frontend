// src/services/authService.ts

export interface UserInfo {
  username: string;
  [key: string]: any; // 允許有其他欄位
}

function getToken(): string | null {
  return localStorage.getItem('token');
}

function decodeTokenPayload(): any | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch {
    return null;
  }
}

function getUsername(): string | null {
  const payload = decodeTokenPayload();
  return payload?.username ?? null;
}

function isLoggedIn(): boolean {
  return !!getUsername();
}

function login(token: string) {
  localStorage.setItem('token', token);
}


function logout() {
  localStorage.removeItem('token');
}

export const authService = {
  getToken,
  getUsername,
  isLoggedIn,
  login,
  logout,
};
