import * as walletApi from '@/mocks/api/walletApi.mock'

export const listWalletsForUser = (userId) =>
  walletApi.listWalletsForUser(userId)

export const createWallet = (walletData) => walletApi.createWallet(walletData)

export const getWalletMembership = (params) =>
  walletApi.getWalletMembership(params)
