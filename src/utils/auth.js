export const getAuthToken = () => {
  return localStorage.getItem('@project:token') || sessionStorage.getItem('@project:token');
};

export const getAuthUser = () => {
  const user = localStorage.getItem('@project:user') || sessionStorage.getItem('@project:user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = () => {
  localStorage.removeItem('@project:token');
  localStorage.removeItem('@project:user');
  sessionStorage.removeItem('@project:token');
  sessionStorage.removeItem('@project:user');
};