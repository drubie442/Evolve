const TOKEN_KEY = 'sp_token';
const USER_KEY  = 'sp_user';

export function getToken()  { return localStorage.getItem(TOKEN_KEY); }

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
}

export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn()   { return Boolean(getToken()); }
export function isStaff()      { return getUser()?.role === 'staff'; }
export function isCarer()      { return getUser()?.role === 'carer'; }

export function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}
