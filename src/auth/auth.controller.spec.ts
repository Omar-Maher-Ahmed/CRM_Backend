// what user need in this module

// Register	POST /auth/register : 
//// 1- Is the email available?
//// 2- If it exists, throw Error
//// 3- Make a hash for the password
//// 4- Save User
//// 5- Return Response : 

// Login	POST /auth/login:
//// 1- Give User
//// 2- Compare Password
//// 3- If there is an error
//// 4- If true, Generate Token
//// 5- Token is back

// Profile	GET /auth/profile
//// 1-Verify Refresh Token
//// 2- findById 
//// Return user data withuot password

// Refresh	POST /auth/refresh
//// 1- Verify Refresh Token
//// 2- Generate Access Token New
//// 3- Return it

// Logout	POST /auth/logout
//// 1- Verify Refresh Token
//// 2- Remove Refresh Token
