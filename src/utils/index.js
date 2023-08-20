const _ = require('lodash');
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

const convertTypes = (id) => {
    return new Types.ObjectId(id);
}

module.exports = {
    getInfoData,
    convertTypes
}