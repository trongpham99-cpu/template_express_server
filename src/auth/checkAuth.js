const { findById } = require('../services/apiKey.service')
const { HEADER } = require('../_const')

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.AKY_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                code: '403',
                message: 'Forbidden'
            })
        }

        const objKey = await findById(key)
        if (!objKey) {
            return res.status(403).json({
                code: '403',
                message: 'Cannot find api key'
            })
        }

        req.objKey = objKey
        next()
    } catch (error) {

    }
}

const permissions = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                code: '403',
                message: 'Permission denied'
            })
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                code: '403',
                message: 'Permission denied'
            })
        }

        next()
    }
}

module.exports = {
    apiKey,
    permissions,
}