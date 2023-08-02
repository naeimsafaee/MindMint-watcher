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
		name: {
			type: DataTypes.STRING,
		},
		cardTypeId: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		amounts: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
		},
		type: {
			type: DataTypes.ENUM("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE"),
			allowNull: false,
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
