import { readUsers, writeUsers } from "@/mocks/data/userData";
import { latency } from "@/mocks/utils/fakeLatency";
import * as SessionData from "@/mocks/data/sessionData";
import {
  createSessionRecord,
  isSessionRecordActive,
  touchSessionRecord,
} from "@/mocks/models/sessionModel";
import {
  createUser,
  isSameEmail,
  toPublicUser,
} from "@/mocks/models/userModel";

export async function registerUser({ name, email, password }) {
  await latency();

  const users = readUsers();
  const emailTaken = users.some((user) => isSameEmail(user.email, email));

  if (emailTaken) {
    throw new Error("Este e-mail já está cadastrado");
  }

  const user = createUser({ name, email, password });

  writeUsers([...users, user]);

  return { user: toPublicUser(user) };
}

export async function login({ email, password, rememberMe = false }) {
  await latency();

  const user = readUsers().find(
    (candidate) =>
      isSameEmail(candidate.email, email) && candidate.password === password,
  );

  if (!user) {
    throw new Error("E-mail ou senha incorretos");
  }

  const sessionRecord = createSessionRecord(user.id, { rememberMe });

  SessionData.writeSessionRecord(sessionRecord);

  return { user: toPublicUser(user) };
}

export async function restoreSession() {
  const sessionRecord = SessionData.readSessionRecord();

  if (!isSessionRecordActive(sessionRecord)) {
    SessionData.clearSessionRecord();
    return null;
  }

  const user = readUsers().find(
    (candidate) => String(candidate.id) === String(sessionRecord.userId),
  );

  if (!user) {
    SessionData.clearSessionRecord();
    return null;
  }

  SessionData.writeSessionRecord(touchSessionRecord(sessionRecord));

  return { user: toPublicUser(user) };
}

export async function logout() {
  await latency();
  SessionData.clearSessionRecord();
}

export function subscribeToAuthStateChanges(listener) {
  const handleStorage = (event) => {
    if (event.key === SessionData.SESSION_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => window.removeEventListener("storage", handleStorage);
}
