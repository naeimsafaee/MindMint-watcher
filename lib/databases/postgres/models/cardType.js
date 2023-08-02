const { DataTypes } = require("sequelize");

module.exports = {
    attributes: {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(32)
        },
        image: {
            type: DataTypes.JSONB,
            defaultValue: []
        },
        isInBox: {
            type: DataTypes.BOOLEAN,
            default: false,
            defaultValue: false
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
            defaultValue: "ACTIVE"
        },
        showInMarket: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        order: {
            type: DataTypes.INTEGER
        },
        calculator_image: {
            type: DataTypes.JSONB,
            defaultValue: []
        }
    },
    options: {
        timestamps: true,
        paranoid: true
    }
};
