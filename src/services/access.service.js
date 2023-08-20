const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { RoleShop } = require('../_const')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

class AccessService {

    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (!foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken)

            await KeyTokenService.deleteByID(userId)
            throw new BadRequestError('Error: Refresh token is invalid !')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new BadRequestError('Error: Refresh token is invalid !')

        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Error: Shop not found !')

        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: { userId, email },
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delKey = await KeyTokenService.deleteKeyToken(keyStore._id)
        return delKey
    }

    static login = async ({ email, password }) => {
        const foundShop = await findByEmail({ email })
        if (!foundShop) {
            throw new BadRequestError('Error: Shop not found !')
        }

        const isMatch = await bcrypt.compare(password, foundShop.password)
        if (!isMatch) {
            throw new BadRequestError('Error: Password is incorrect !')
        }

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId: userId }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            userId: userId,
            refreshToken: tokens.refreshToken,
            privateKey: privateKey,
            publicKey: publicKey,
        })

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error: Shop already exists !')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const publicKey = crypto.randomBytes(64).toString('hex')
            const privateKey = crypto.randomBytes(64).toString('hex')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey: publicKey,
                privateKey: privateKey
            })

            if (!keyStore) {
                throw new BadRequestError('Error: Cannot create key token !')
            }

            const tokens = await createTokenPair({ userId: newShop._id }, publicKey, privateKey)

            return {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            }

        }

        return null
    }
}

module.exports = AccessService