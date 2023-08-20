const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'api_key'
const COLLECTION_NAME = 'api_keys'

var apiKeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, apiKeySchema);