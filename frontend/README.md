# Cookies

## Frontend (Browser JavaScript,no package required)

```javascript
// CREATE / UPDATE
document.cookie = "name=Abhishek; max-age=3600; path=/; SameSite=Strict";
// max-age=3600 → Duration: cookie lives for 1 hour
// path=/ → Cookie available on all paths
// SameSite=Strict → Cookie sent only in same-site requests

// READ
console.log(document.cookie); // Read accessible cookies

// DELETE
document.cookie = "name=; max-age=0; path=/"; // Delete cookie immediately
```

## Backend (Express)

**Install packages**

```bash
npm i express cookie-parser
```

```javascript
// SETUP
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // Parse cookies into req.cookies

// CREATE / UPDATE
res.cookie("token", token, {
    httpOnly: true, // JavaScript cannot access the cookie
    secure: true, // Cookie sent over HTTPS only
    sameSite: "strict", // Controls cross-site cookie sending
    maxAge: 60 * 60 * 1000, // Duration: cookie lives for 1 hour
    expires: new Date(Date.now() + 60 * 60 * 1000), // Exact expiration date and time
    path: "/", // Cookie available on all paths
    domain: "example.com" // Cookie available for this domain and its subdomains
});

// READ
const token = req.cookies.token; // Read the token cookie

// DELETE
res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    domain: "example.com"
}); // Delete cookie using matching options
```