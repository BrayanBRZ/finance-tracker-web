import { latency } from "@/mocks/utils/fakeLatency";
import {
  createSessionRecord,
  isSessionRecordActive,
  touchSessionRecord,
} from "@/mocks/models/sessionModel";
import { createUser, toPublicUser } from "@/mocks/models/userModel";
import {
  clearSessionRecord,
  readSessionRecord,
  SESSION_STORAGE_KEY,
  writeSessionRecord,
} from "@/mocks/repositories/sessionRepository.mock";
import {
  appendUser,
  findUserByEmail,
  findUserById,
} from "@/mocks/repositories/userRepository.mock";

export async function registerUser({ name, email, password }) {
  await latency();

  const emailTaken = Boolean(findUserByEmail(email));

  if (emailTaken) {
    throw new Error("Este e-mail já está cadastrado");
  }

  const user = createUser({ name, email, password });

  appendUser(user);

  return { user: toPublicUser(user) };
}

export async function login({ email, password, rememberMe = false }) {
  await latency();

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    throw new Error("E-mail ou senha incorretos");
  }

  const sessionRecord = createSessionRecord(user.id, { rememberMe });

  writeSessionRecord(sessionRecord);

  return { user: toPublicUser(user) };
}

export async function restoreSession() {
  const sessionRecord = readSessionRecord();

  if (!isSessionRecordActive(sessionRecord)) {
    clearSessionRecord();
    return null;
  }

  const user = findUserById(sessionRecord.userId);

  if (!user) {
    clearSessionRecord();
    return null;
  }

  writeSessionRecord(touchSessionRecord(sessionRecord));

  return { user: toPublicUser(user) };
}

export async function logout() {
  await latency();
  clearSessionRecord();
}

export function subscribeToAuthStateChanges(listener) {
  const handleStorage = (event) => {
    if (event.key === SESSION_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => window.removeEventListener("storage", handleStorage);
}
