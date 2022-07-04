let jwt = require('jsonwebtoken');
const fakeAuth = () => {
  console.log('fake auth');
  next();
};

const verifyJWT = (req, res, next) => {
if(req.body.password){
  next();
}
};

module.exports = {
  fakeAuth,
  verifyJWT
}