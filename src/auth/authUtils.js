const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { HEADER } = require('../_const')
const { BadRequestError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '30 days'
        })

        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new BadRequestError('Error: Create token pair failed !')
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new BadRequestError('Error: Client ID is required !')

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Error: Key Store not found !')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new BadRequestError('Error: Access Token is required !')

    try {
        const decodeUser = await JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new BadRequestError('Error: Invalid Access Token !')
        req.keyStore = keyStore
        next()
    } catch (error) {
        throw new BadRequestError('Error: Invalid Access Token !')
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}