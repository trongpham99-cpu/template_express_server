const AccessService = require('../services/access.service')
const { CREATED, OK, SuccessResponse } = require('../core/success.response')

class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        new OK({
            message: 'Refresh Token Success',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }

    logout = async (req, res, next) => {
        new OK({
            message: 'Logout Shop Success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login Shop Success',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Register Shop Success',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()