import axios from 'axios';
import { BASE_URL } from '../config/config';

export async function getAllPVs() {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${BASE_URL}/k8s/pv`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function createPV(pvName: string) {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${BASE_URL}/k8s/pv/${pvName}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function deletePV(pvName: string) {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${BASE_URL}/k8s/pv/${pvName}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}


export async function getAllPVCs() {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${BASE_URL}/k8s/pvc`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function getNamespacedPVCs() {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${BASE_URL}/k8s/pvcns`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function createPVC(pvcName: string) {
  const token = localStorage.getItem('token');
  const res = await axios.post(`${BASE_URL}/k8s/pvc/${pvcName}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function deletePVC(pvcName: string) {
  const token = localStorage.getItem('token');
  const res = await axios.delete(`${BASE_URL}/k8s/pvc/${pvcName}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}
