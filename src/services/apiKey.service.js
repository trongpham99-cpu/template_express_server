const apiKeyModel = require("../models/apiKey.model")
const crypto = require('crypto')

const findById = async (key) => {
    // const newKey = await apiKeyModel.create({
    //     key: crypto.randomBytes(16).toString('hex'),
    //     permissions: ['0000'],
    //     status: true
    // })
    // console.log(newKey)
    const objKey = await apiKeyModel.findOne({
        key: key,
        status: true
    }).lean()

    return objKey
}

module.exports = {
    findById
}