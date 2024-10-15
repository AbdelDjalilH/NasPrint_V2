const argon2 = require("argon2");
const { findOneByEmail, createUser} = require("../models/user");

const login= async (req, res) => {
    const { email, password} = req.body;
    const user = await findOneByEmail(email);

    if(!user) {
        return res
        .status(401)
        .json({success: false, message: "Invalid creditentials"});

    }


const passwordMatch = await argon2.verify(user.password, password);

if(!passwordMatch) {
    return res
    .status(401)
    .json({success: false, message: "Invalid creditentials"});
}

res.json({success: true, user: { id: user.id, email: user.email } });
};

const register = async ( req, res) => {
    const {email, password, firstname, lastname} = req.body;
    console.log(email, password, firstname, lastname);

    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword);

    try {
        const userId = await createUser({
            email,
            password: hashedPassword,
            firstname,
            lastname,
        });
        req.json({ success: true, userId: userId});
    } catch (error) {
        console.error("Error registering user", error);
        res.status(500).json({ success: false, message: "Internal server error"});
    }
        };

        const checkAuth = (req, res) => {
            res.json({authenticated: true});
        };

        module.exports= {login,
             register,
              checkAuth
            };