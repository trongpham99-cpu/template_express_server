const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'

const shopSchema = new Schema({
    name: {
        type: String,
        index: true,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, shopSchema);