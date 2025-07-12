import axios from 'axios';
import { BASE_URL } from '../config/config';

export async function getAllNotebooks() {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${BASE_URL}/notebook`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}
export async function getUserNotebooks(userId: string) {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${BASE_URL}/notebook/${userId}`,  {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
  return res.data;
}

export async function createNotebook(pvcname: string) {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${BASE_URL}/notebook`, { pvcname }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function deleteNotebook(id: string) {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${BASE_URL}/notebook`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    data: { id }
  });
  return res.data;
}