
const fakeAuth = () => {
  console.log('fake auth');
  next();
};

const verifyJWT = (req, res) => {

  next();
};

module.exports = fakeAuth;