import axios from 'axios';
import { BASE_URL } from '../config/config';

export async function registerUser(username: string, password: string) {
  const res = await axios.post(`http://10.121.124.22:30080/register`, { username, password });
  return res.data;
}

export async function loginUser(username: string, password: string) {
  const res = await axios.post(`http://10.121.124.22:30080/login`, { username, password });
  return res.data;
}

export async function getAllUsers(token: string) {
  const res = await axios.get(`${BASE_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// 未測試! 取得特定使用者
export async function getUserById(id: number, token: string) {
  const res = await axios.get(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// 未測試! 更新使用者資料
export async function updateUser(id: number, data: Partial<{ username: string }>, token: string) {
  const res = await axios.patch(`${BASE_URL}/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// 未測試! 修改使用者密碼
export async function changeUserPassword(
  id: number,
  oldPassword: string,
  newPassword: string,
  token: string
) {
  const res = await axios.patch(
    `${BASE_URL}/users/${id}/password`,
    { oldPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
}

// 未測試! 刪除使用者
export async function deleteUser(id: number, token: string) {
  const res = await axios.delete(`${BASE_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}