const TOKEN_KEY = 'referral_token';
const WORKER_KEY = 'referral_worker';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getWorker() {
  try {
    return JSON.parse(localStorage.getItem(WORKER_KEY));
  } catch {
    return null;
  }
}

export function setAuth(token, worker) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(WORKER_KEY, JSON.stringify(worker));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(WORKER_KEY);
}

export function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export function isLoggedIn() {
  return Boolean(getToken());
}
