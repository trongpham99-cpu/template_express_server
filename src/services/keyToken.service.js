const keytokenModel = require("../models/keytoken.model")
const { convertTypes } = require("../utils")

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId }, update = {
                publicKey: publicKey,
                privateKey: privateKey,
                refreshTokenUsed: [],
                refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: convertTypes(userId) }).lean()
    }

    static deleteKeyToken = async (userId) => {
        return await keytokenModel.deleteOne({ user: convertTypes(userId) })
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken }).lean()
    }

    static deleteByID = async (userId) => {
        return await keytokenModel.findByIdAndDelete({ user: convertTypes(userId) })
    }
}

module.exports = KeyTokenService