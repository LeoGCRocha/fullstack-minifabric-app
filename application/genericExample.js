'use strict'

export async function readAccount(contract, userId) {
    return contract.evaluateTransaction('Read', userId)
}

// create if not exists
export async function updateAccount(contract, userId, userName) {
    return contract.submitTransaction('Input', userId, userName)
}
