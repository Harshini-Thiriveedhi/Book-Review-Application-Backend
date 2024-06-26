const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const cors=require('cors');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;


const app = express();

//middleware
app.use(cors());

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

let users = require('./router/users.js');

//function doesExist
const doesExist = (username) => {
    return users.some(user => user.username === username);
};

// Register a new user
app.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ username, password: password.toString() });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});


app.use("/customers/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));