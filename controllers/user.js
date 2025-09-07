const User = require("../models/user");
const jwt = require("jsonwebtoken");


async function handleCreateNewUser(req, res) {
    const {name, email, role, password} = req.body;

    try {
        const user =  await User.create({
            name,
            email, password, role
        });
    } catch (error) {
        res.render('signup', {msg: "Please provide all details"})
    }
  

    return res.render('login', {msg: ''})

}

async function handleLoginUser(req, res) {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({msg: "Please provide all details"});
    const user = await User.findOne({email, password});
    if(!user) return res.render('login', {msg: "invalid email or password"})

    try {
        jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.JWT_SCRETE,
            { expiresIn: '1h' },
            function(err, token) {
                if (err || !token) {
                    return res.render('login',{ msg: "Failed to generate token" });
                }
                res.cookie('token', token, {
                    maxAge: 3600000, // 1 hour in milliseconds
                    httpOnly: true,
                    sameSite: 'lax'
                });
                return res.redirect('/');
            }
        );
        // console.log(token)
    } catch (error) {
        return res.render('login',{msg: "invalid email or password"});
    }

}

module.exports = {
    handleCreateNewUser,
    handleLoginUser
}
