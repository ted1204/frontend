// src/hooks/useAuthInfo.ts
import { authService } from '../services/authService';

export function useAuthInfo() {
  const token = authService.getToken() || '';
  const username = authService.getUsername();
  const pvcname = 'pvc-home';
  return { token, username, pvcname };
}
