const { URL } = require("../models/url");
const shortid = require("shortid");

async function handleGenerateShortUrl(req, res) {
  const shortId = shortid.generate();
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ mes: "vaild url is required" });
  }
  await URL.create({
    shortId: shortId,
    redirectUrl: url,
    visitHistory: [],
  });

  const allUrls = await URL.find({})

  return res.render('home', {id: shortId, allUrls})
//   return res.status(201).json({ id: shortId });
}

async function handleRedirectToUrl(req, res) {
  let shortId = req.params.shortId;
  let entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timeStamp: Date.now(),
        },
      },
    }
  );
  console.log(entry);
  return res.redirect(entry.redirectUrl);
}

async function handleGetAnalytics(req, res) {
  let shortId = req.params.shortId;
  let entry = await URL.findOne({ shortId });
  return res.status(200).json({
    totalNumberOfClicks: entry.visitHistory.length,
    analytics: entry.visitHistory,
  });
}

module.exports = {
  handleGenerateShortUrl,
  handleRedirectToUrl,
  handleGetAnalytics,
};
