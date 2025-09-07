const {URL} = require('../models/url');


async function handleHomeGetAllURL(req, res) {
    const allUrls = await URL.find({});
    const user = req.user;
    console.log(user)
    return res.status(200).render('home', {allUrls, user})   
}

module.exports = {
    handleHomeGetAllURL
}