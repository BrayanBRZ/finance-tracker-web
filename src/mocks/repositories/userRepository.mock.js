import { readUsers, writeUsers } from '@/mocks/data/userData'
import { isSameEmail } from '@/mocks/models/userModel'
import { isSameId } from '@/mocks/utils/id'

export function listUsers() {
  return readUsers()
}

export function findUserById(userId) {
  return listUsers().find((user) => isSameId(user.id, userId))
}

export function findUserByEmail(email) {
  return listUsers().find((user) => isSameEmail(user.email, email))
}

export function appendUser(user) {
  writeUsers([...listUsers(), user])
}
