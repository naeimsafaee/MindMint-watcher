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
		title: {
			type: DataTypes.STRING(300),
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		service: {
			type: DataTypes.ENUM("STARLEX"),
			defaultValue: "STARLEX",
		},
		parent: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		images: {
			type: DataTypes.JSONB,
			defaultValue: [],
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM("FAQ", "ARTICLE"),
			defaultValue: "ARTICLE",
		},
	},
	options: {
		timestamps: true,
		paranoid: true,
	},
};
