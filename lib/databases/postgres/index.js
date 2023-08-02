const config = require("config").get("databases.postgres");

const {Sequelize, Op, literal} = require("sequelize");

/** ===================================================================================================== **/
/**
 * Game Center Models and Database
 */

const sequelize = new Sequelize(config.database, config.username, config.password, config.options);
// const sequelize = new Sequelize(config.database, config.username, config.password, {
// 	...config.options,
// 	...{ logging: console.log },
// });

sequelize
    .authenticate()
    .then(() => {
        // console.log(`*** Syncing database...`);
    })
    .catch((e) => {
        console.log("*** POSTGRES Error: ", e);
    });

const __user = require("./models/user");
const User = sequelize.define("user", __user.attributes, __user.options);

const __userWallet = require("./models/userWallet");
const UserWallet = sequelize.define("userWallet", __userWallet.attributes, __userWallet.options);

const __settings = require("./models/settings");
const Settings = sequelize.define("setting", __settings.attributes, __settings.options);

const __systemWallet = require("./models/systemWallet");
const SystemWallet = sequelize.define("systemWallet", __systemWallet.attributes, __systemWallet.options);

const __auction = require("./models/auction");
const Auction = sequelize.define("auction", __auction.attributes, __auction.options);

const __assignedCard = require("./models/assignedCard");
const AssignedCard = sequelize.define("assignedCard", __assignedCard.attributes, __assignedCard.options);



const __card = require("./models/card");
const Card = sequelize.define("card", __card.attributes, __card.options);

const __owner = require("./models/owner");
const Owner = sequelize.define("owner", __owner.attributes, __owner.options);

Owner.sync({alter: true}).then().catch((err) => {});

const __cardType = require("./models/cardType");
const CardType = sequelize.define("cardTypes", __cardType.attributes, __cardType.options);

const __attribute = require("./models/attribute");
const Attribute = sequelize.define("attribute", __attribute.attributes, __attribute.options);

const __userAttribute = require("./models/userAttribute");
const UserAttribute = sequelize.define("userAttribute", __userAttribute.attributes, __userAttribute.options);

const __box = require("./models/box");
const Box = sequelize.define("box", __box.attributes, __box.options);

const __userBox = require("./models/userBox");
const UserBox = sequelize.define("userBox", __userBox.attributes, __userBox.options);

const __boxAuction = require("./models/boxAuction");
const BoxAuction = sequelize.define("boxAuction", __boxAuction.attributes, __boxAuction.options);

const __boxSetting = require("./models/boxSetting");
const BoxSetting = sequelize.define("boxSetting", __boxSetting.attributes, __boxSetting.options);

const __boxTrade = require("./models/boxTrade");
const BoxTrade = sequelize.define("boxTrade", __boxTrade.attributes, __boxTrade.options);

User.hasMany(BoxTrade, {foreignKey: "userId"});
BoxTrade.belongsTo(User, {foreignKey: "userId"});

BoxAuction.hasMany(BoxTrade, {foreignKey: "boxAuctionId"});
BoxTrade.belongsTo(BoxAuction, {foreignKey: "boxAuctionId"});

CardType.hasMany(BoxSetting, {foreignKey: "cardTypeId"});
BoxSetting.belongsTo(CardType, {foreignKey: "cardTypeId"});

CardType.hasMany(Box, {foreignKey: "cardTypeId"});
Box.belongsTo(CardType, {foreignKey: "cardTypeId"});

Card.hasMany(Box, {foreignKey: "cardId"});
Box.belongsTo(Card, {foreignKey: "cardId"});

User.hasMany(UserBox, {foreignKey: "userId"});
UserBox.belongsTo(User, {foreignKey: "userId"});

Box.hasMany(UserBox, {foreignKey: "boxId"});
UserBox.belongsTo(Box, {foreignKey: "boxId"});

BoxAuction.hasMany(UserBox, {foreignKey: "boxAuctionId"});
UserBox.belongsTo(BoxAuction, {foreignKey: "boxAuctionId"});

Box.hasMany(BoxAuction, {foreignKey: "boxId"});
BoxAuction.belongsTo(Box, {foreignKey: "boxId"});

CardType.hasMany(Attribute, {foreignKey: "cardTypeId"});
Attribute.belongsTo(CardType, {foreignKey: "cardTypeId"});

User.hasMany(UserAttribute, {foreignKey: "userId"});
UserAttribute.belongsTo(User, {foreignKey: "userId"});

Card.hasMany(UserAttribute, {foreignKey: "cardId"});
UserAttribute.belongsTo(Card, {foreignKey: "cardId"});

Attribute.hasMany(UserAttribute, {foreignKey: "attributeId"});
UserAttribute.belongsTo(Attribute, {foreignKey: "attributeId"});

BoxTrade.hasMany(UserAttribute, {foreignKey: "boxTradeId"});
UserAttribute.belongsTo(BoxTrade, {foreignKey: "boxTradeId"});

CardType.hasMany(Card, {foreignKey: "cardTypeId"});
Card.belongsTo(CardType, {foreignKey: "cardTypeId"});

Card.hasMany(AssignedCard, {foreignKey: "cardId"});
AssignedCard.belongsTo(Card, {foreignKey: "cardId"});

User.hasMany(AssignedCard, {foreignKey: "userId"});
AssignedCard.belongsTo(User, {foreignKey: "userId"});

User.hasMany(Auction, {foreignKey: "userId", as: "auction"});
Auction.belongsTo(User, {foreignKey: "userId", as: "user"});

Card.hasMany(Auction, {foreignKey: "cardId"});
Auction.belongsTo(Card, {foreignKey: "cardId"});

User.hasMany(UserWallet, {foreignKey: "userId", as: "assets"});
UserWallet.belongsTo(User, {foreignKey: "userId", as: "user"});

const models = {
    User,
    UserWallet,
    Settings,
    SystemWallet,
    Auction,
    CardType,
    Card,
    AssignedCard,
    Attribute,
    UserAttribute,
    Box,
    UserBox,
    BoxAuction,
    BoxSetting,
    BoxTrade,
    Owner
};


module.exports = {sequelize, Op, Sequelize, literal, ...models};
