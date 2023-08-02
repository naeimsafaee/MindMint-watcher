const Web3 = require("web3");
const config = require("config");
const {postgres} = require("../databases");
const nftAbi = require("../data/erc721.json");

const provider = new Web3.providers.WebsocketProvider(config.get("RPC.ETHEREUM"));
const web3 = new Web3(provider);

const contractAddress = config.get("CONTRACT.MIND-MINT").toLowerCase();

const mindMintContract = new web3.eth.Contract(nftAbi, contractAddress);

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const MANAGER_WALLET = config.get("CONTRACT.MANAGER_WALLET").toLowerCase();

async function watch() {
    console.log("Start watching on mind-mint nft contract...");

    let setting = await postgres.Settings.findOne({
        where: {
            type: "watcher",
            key: "lastCheckedBlock"
        }
    });
    if (!setting)
        setting = await postgres.Settings.create({
            where: {
                type: "watcher",
                key: "lastCheckedBlock",
                value: 0
            }
        }, {returning: true});
    let fromBlock = parseInt(setting.value);

    mindMintContract.events.allEvents({
        fromBlock: fromBlock + 1
    }, async (error, event) => {

        console.log({event})

        if (event && event.returnValues) {
            const returnValues = event.returnValues;

            const tokenId = returnValues.tokenId;
            const from = returnValues.from.toLowerCase();
            const to = returnValues.to.toLowerCase();

            console.log("Data received", {tokenId, from: from, to: to})

            if (from === NULL_ADDRESS) {
                //mint
                if (to === contractAddress) {
                    //card with the tokenId minted

                    await postgres.Owner.create({
                        from: from,
                        to: to,
                        tokenId: tokenId,
                        action: "MINT",
                        txId: event.transactionHash,
                        blockNumber: event.blockNumber
                    });

                    const card = await postgres.Card.findOne({
                        where: {
                            tokenId: tokenId
                        }
                    });
                    if (card) {

                        const auction = await postgres.Auction.findOne({
                            where: {
                                cardId: card.id
                            }
                        });
                        if (auction && auction.mintType === "User"
                            && auction.status === "ACTIVE") {

                            await auction.update({status: "FINISHED"});

                            await postgres.AssignedCard.create({
                                userId: auction.userId,
                                cardId: card.id,
                                type: "IN_SYSTEM"
                            });

                            //todo assign attribute

                        }
                    }

                } else {
                    //mint is invalid
                }

            } else if (to === NULL_ADDRESS) {
                //nft burned
                await postgres.Owner.create({
                    from: from,
                    to: to,
                    tokenId: tokenId,
                    action: "BURN",
                    txId: event.transactionHash,
                    blockNumber: event.blockNumber
                });

                const card = await postgres.Card.findOne({
                    where: {
                        tokenId: tokenId
                    }
                });
                if (card) {
                    await card.increment("leftAmount", {by: 1});

                    const assignedCard = await postgres.AssignedCard.findOne({
                        where: {
                            cardId: card.id
                        }
                    });

                    if (assignedCard)
                        await assignedCard.destroy();

                    //todo delete attribute
                }

            } else {
                //transfer
                if (from === contractAddress) {
                    //withdraw nft from system

                    await postgres.Owner.create({
                        from: from,
                        to: to,
                        tokenId: tokenId,
                        action: "WITHDRAW",
                        txId: event.transactionHash,
                        blockNumber: event.blockNumber
                    });

                    const card = await postgres.Card.findOne({
                        where: {
                            tokenId: tokenId
                        }
                    });
                    if (card) {
                        const assignedCard = await postgres.AssignedCard.findOne({
                            where: {
                                cardId: card.id,
                                type: "IN_SYSTEM"
                            }
                        });

                        if (assignedCard)
                            await assignedCard.update({
                                type: "WITHDRAW",
                                userId: null
                            });

                        //todo remove userId from attribute
                    }

                } else if (to === contractAddress) {
                    //Deposit nft to system

                    await postgres.Owner.create({
                        from: from,
                        to: to,
                        tokenId: tokenId,
                        action: "DEPOSIT",
                        txId: event.transactionHash,
                        blockNumber: event.blockNumber
                    });

                    const card = await postgres.Card.findOne({
                        where: {
                            tokenId: tokenId
                        }
                    });
                    if (card) {
                        const assignedCard = await postgres.AssignedCard.findOne({
                            where: {
                                cardId: card.id,
                                type: "IN_SYSTEM"
                            }
                        });

                        const user = await postgres.User.findOne({
                            where: {
                                address: {[postgres.Op.iLike]: from}
                            }
                        });

                        if(user){
                            await assignedCard.update({
                                type: "IN_SYSTEM",
                                userId: user.id
                            });
                            //todo assign userId to attributes
                        }

                    }


                } else {
                    //transfer between users
                    await postgres.Owner.create({
                        from: from,
                        to: to,
                        tokenId: tokenId,
                        action: "TRANSFER",
                        txId: event.transactionHash,
                        blockNumber: event.blockNumber
                    });
                }
            }
        }

        await setting.update({
            value: event.blockNumber
        });
    });

}

async function getData(fromBlock, latestBlock, blockCountIteration) {
    let toBlock = fromBlock + blockCountIteration;

    if (toBlock > latestBlock)
        return;

    console.log(`start checking from block ${fromBlock} to block ${toBlock} , ${latestBlock}`);

    const events = await stylContract.getPastEvents("Transfer", {
        fromBlock: fromBlock,
        toBlock: toBlock
    }).catch((err) => {
        console.log(err);
    });

    let createValues = [];

    for (let i = 0; i < events.length; i++) {
        const event = events[i];

        const blockChecked = await postgres.Owner.findOne({
            where: {
                blockNumber: event.blockNumber
            }
        });

        if (!blockChecked) {
            createValues.push({
                cardEdition: event.returnValues.tokenId,
                fromAddress: event.returnValues.from === "0x0000000000000000000000000000000000000000" ? "mint" : event.returnValues.from,
                toAddress: event.returnValues.to,
                txId: event.transactionHash,
                blockNumber: event.blockNumber
            });
        }

    }

    await postgres.Owner.bulkCreate(createValues).then(() => {

        fromBlock = toBlock + blockCountIteration;

        if (createValues.length > 0)
            console.log(`updated ${createValues.length} data`);

        postgres.Settings.update({
            value: toBlock
        }, {
            where: {
                type: "watcher",
                key: "lastCheckedBlock"
            }
        }).then(() => {

            setTimeout(() => {
                getData(fromBlock, latestBlock, blockCountIteration);
            }, 500);
        }).catch((err) => {
            console.log(err);
        });

    }).catch((err) => {
        console.log(err);
    });

}

exports.init = function () {
    watch();
};
