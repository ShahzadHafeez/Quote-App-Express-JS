# Quote-App-Express-JS

This is a complete stand alone quote app that receives quote requests from shopify store and after properly validation store the data into mongodb. I have created sigin and signup pages, so a user can see saved records.

In order to develop this app, I have used Express JS framework, mongoDB remote client and MVC model.

## complete list of libraries used in the app:
- @hapi/joi: for form data server validation
- bcryptjs: to encrypt users password before to save in database
- cors: to accept the request from Shopify store
- dotenv: to save tokens and secret keys etc.
- ejs: embedded javascript for templates
- express: express js framework
- express-session: session for user login
- jsonwebtoken: token for user's authorization
- mongoose: for database

## list of client side jquery plugins used in the app:
- Validation Plugin: for client side form validation
- DataTables Plugin: for table controls
