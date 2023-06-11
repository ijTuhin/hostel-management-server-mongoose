const jwt = require("jsonwebtoken");
const checkAdminLogin = (req, res, next) => {
    const { authorization } = req.headers;
    try{
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_JWT_TOKEN);
        const {email, adminId} = decoded;
        req.email = email
        req.adminId = adminId;
        next();
    }
    catch{
        next("Authentication failure!")
    }
}


module.exports = checkAdminLogin;