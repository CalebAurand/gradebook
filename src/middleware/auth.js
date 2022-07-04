let jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  //get the token from the header
  let signedToken;
  let header = req.get('Authorization');

  //check to see if there is something in the authorization header
  if(header){
    let parts = header.split(' ');
    signedToken = parts[1];
  };

  //verify that the token is good
  if(signedToken){
    jwt.verify(signedToken, process.env.JWT_SECRET, (err, decoded)=>{
      if(err){
        //if the token cannot be verified send back the 400 error code
        res.sendStatus(400);
      } else {
        let token = jwt.verify(signedToken, process.env.JWT_SECRET);
        req.token = token;
        //if the signed token passes, call the next callback function in the route chain
        next();
      }
    })
  } else {
    //if there is no signedToken to verify, send 400 error
    res.sendStatus(400);
  }
};

module.exports = {
  verifyJWT
}