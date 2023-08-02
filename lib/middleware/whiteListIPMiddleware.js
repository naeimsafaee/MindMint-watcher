exports.whiteListIp = (req, res, next) => {

    const whiteList = ["3.67.222.91"];

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log(ip)

    return next()

    if (whiteList.indexOf(ip) >= 0)
        return next()

    return res.status(403).send({
        message: "You are not authorized!"
    })
}