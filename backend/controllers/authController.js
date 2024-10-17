const argon2 = require("argon2");

const { findOneByEmail} = require("../models/user");

const login = async (req, res) => {
    
    const { email, password} = req.body;
    const user = await findOneByEmail(email);
    


if(!user) {
    return res
    .status(401)
    .json({message: false, message: "Identifiants incorrects"});
    
}

const passwordMatch = await  argon2.verify(user.password, password);

if(!passwordMatch) {
    return res
    .status(401)
    .json({message: "Identifiants incorrects"});
    
}

res
.status(200)
.json
({ user: { id: user.id, email: user.email, role: "ADMIN"  }});

};

module.exports = { login };
// const register = async ( req, res) => {
//     const {email, password, firstname, lastname} = req.body;
//     console.log(email, password, firstname, lastname);

//     const hashedPassword = await argon2.hash(password);
//     console.log(hashedPassword);

//     try {
//         const userId = await createUser({
//             email,
//             password: hashedPassword,
//             username,
//             
//         });
//         req.json({ success: true, userId: userId});
//     } catch (error) {
//         console.error("Error registering user", error);
//         res.status(500).json({ success: false, message: "Internal server error"});
//     }
//         };

//         const checkAuth = (req, res) => {
//             res.json({authenticated: true});
//         };

//         module.exports= {login,
//              register,
//               checkAuth
//             };