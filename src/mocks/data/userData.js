const USERS_STORAGE_KEY = "@project:users_data";

const mockUsers = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    password: "123456",
  },
];

export function readUsers() {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);

  if (!storedUsers) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers));
    return mockUsers;
  }

  return JSON.parse(storedUsers);
}

export function writeUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}
