import {
  readWalletMembers,
  writeWalletMembers,
} from '@/mocks/data/walletMemberData'
import { isActiveMembership } from '@/mocks/models/walletModel'
import { isSameId } from '@/mocks/utils/id'

export function listWalletMembers() {
  return readWalletMembers()
}

export function listActiveMembershipsForUser(userId) {
  return listWalletMembers().filter(
    (membership) =>
      isSameId(membership.userId, userId) && isActiveMembership(membership),
  )
}

export function findActiveMembership({ walletId, userId }) {
  return listWalletMembers().find(
    (membership) =>
      isSameId(membership.walletId, walletId) &&
      isSameId(membership.userId, userId) &&
      isActiveMembership(membership),
  )
}

export function appendWalletMember(walletMember) {
  writeWalletMembers([...listWalletMembers(), walletMember])
}
