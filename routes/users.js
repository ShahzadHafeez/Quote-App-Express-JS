const router = require("express").Router();
const User = require("../model/user");
const { validateUser, validateLogin } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verify = require("../verifyToken");

router.post("/register", async (req, res) => {
  if (req.session.userId) return res.redirect('/quote/index');
  // validate request data
  console.log(req.body);
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details);

  //check if email already exists
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res
      .status(400)
      .send([
        {
          message: "Account already exists!",
          context: {
            key: "email",
          },
        },
      ]);

  //Hash Password
  const sale = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, sale);

  //create new user
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ id: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/signup", (req, res) => {
  if (req.session.userId) return res.redirect('/quote/index');
  res.render("pages/signup");
});

router.post("/login", async (req, res) => {
  if (req.session.userId) return res.redirect('/quote/index');
  //validate request data
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if account exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send([
    {
      message: "Invalid Email!",
      context: {
        key: "email",
      },
    },
  ]);

  //password check
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send([
    {
      message: "Invalid Password!",
      context: {
        key: "password",
      },
    },
  ]);

  // Prepare Token
  //const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN_SECRET, { expiresIn: '2m' });
  req.session.userId = user._id;
  res.send({ ok: true });
});

router.get("/login", (req, res) => {
  if (req.session.userId) return res.redirect('/quote/index');
  res.render("pages/login");
});

router.get('/logout', (req, res) => {
  if (!req.session.userId) return res.redirect('/user/login');
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/quote/index');
    }
    res.clearCookie(process.env.SESSION_NAME);
    res.redirect('/user/login');
  });
});

// router.get("/", verify, (req, res) => {
//   res.send(req.user);
// });

module.exports = router;
