const { DataTypes } = require("sequelize");

module.exports = {
	attributes: {
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
			unique: true,
		},
		usageNumber: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		lensId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		userId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM("TRANSFER", "BOX"),
			defaultValue: "TRANSFER",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
