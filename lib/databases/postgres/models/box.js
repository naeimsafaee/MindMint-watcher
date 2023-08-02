const {DataTypes} = require("sequelize");

module.exports = {
    attributes: {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        cardTypeId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        image: {
            type: DataTypes.JSONB,
            defaultValue: [],
        },
        status: {
            type: DataTypes.ENUM("IN_AUCTION", "SOLD"),
            defaultValue: "IN_AUCTION",
        },
        megaPixelAmount: {
            type: DataTypes.DECIMAL, default: 0
        },
        batteryAmount: {
            type: DataTypes.DECIMAL, default: 0
        },
        negativeAmount: {
            type: DataTypes.DECIMAL, default: 0
        },
        damageAmount: {
            type: DataTypes.DECIMAL, default: 0
        },
        referralCount: {
            type: DataTypes.INTEGER,
            default: 0,
            defaultValue: 0
        },
        cardId: {
            type: DataTypes.BIGINT,
            default: null,
        },
        lensId: {
            type: DataTypes.BIGINT,
            default: null,
        },
    },
    options: {
        timestamps: true,
        paranoid: true,
    },
};
