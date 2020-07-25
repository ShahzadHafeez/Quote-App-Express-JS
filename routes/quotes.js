const router = require("express").Router();
const Quote = require("../model/quote");
const { validateQuote } = require("../validation");
const verify = require("../verifyToken");

router.post("/create", async (req, res) => {
  //validate request data using JOI
  const { error } = validateQuote(req.body);
  if (error) return res.status(400).send(error.details);

  //validate DateFrom and DateTo difference
  const dateFrom = new Date(req.body.dateFrom);
  const dateTo = new Date(req.body.dateTo);
  dateFrom.setDate(dateFrom.getDate() + 3);
  if (dateTo < dateFrom)
    return res.status(400).send([
      {
        message: "Date To should have 3 days difference from Date From",
        context: {
          key: "dateTo",
        },
      },
    ]);

  //check the requested email has already requested five times
  const count = await Quote.countDocuments({
    email: req.body.email,
    createdAt: new Date().setHours(0, 0, 0, 0),
  });
  if (count >= 5)
    return res.status(400).send([
      {
        message: "Limit Exceeded! You can only send 5 request per day.",
        context: {
          key: "limit",
        },
      },
    ]);

  //create new quote
  const quote = new Quote({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    organizationName: req.body.organizationName,
    email: req.body.email,
    phone: req.body.phone,
    services: req.body.services,
    sizeOfLown: req.body.sizeOfLown,
    additionalRequest: req.body.additionalRequest,
    dateFrom: req.body.dateFrom,
    dateTo: req.body.dateTo,
  });

  try {
    const savedQuote = await quote.save();
    res.send({ id: savedQuote._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/index", async (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');
  const collection = await Quote.find();

  res.render("pages/index", {
    quotes: collection,
    user: true
  });
});

router.get("/view", async (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');
  const quote = await Quote.findOne({ _id: req.query.id });

  res.render("pages/view", {
    quote: quote,
    user: true
  });
});

router.get('/remove', async (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');

  if (!req.query.id) return res.redirect('/quote/index');

  Quote.deleteOne({ _id: req.query.id }, function (err) {
    if (err) return res.redirect('/quote/error');
  });

  res.redirect('/quote/index');
});

router.get('/error', (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');
  res.render("pages/error", {
    message: 'Error Occured while Removing Object.',
    user: true
  });
});

module.exports = router;
