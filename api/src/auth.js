import jwt from 'jsonwebtoken';

const blacklist = [];

function blacklistToken(token) {
  // Add to blacklist but remove again in 15 minutes, or at restart
  // Used on logout to prevent continued logins with old token
  blacklist.push(token);
  setTimeout(() => {
    blacklist.splice(blacklist.indexOf(token), 1);
  }, 15 * 60 * 1000);
}

function checkAuth(token) {
  if (blacklist.includes(token)) return false;
  return jwt.verify(token, process.env.TOKEN_SECRET);
}

export { blacklistToken, checkAuth };
