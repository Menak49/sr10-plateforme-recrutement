function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  return res.redirect('/LogIn');
}

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.session.user;
    if (user && user.roles && allowedRoles.some(role => user.roles.includes(role))) {
      return next();
    }
    return res.status(403).send('Accès interdit');
  };
}

module.exports = {
  isAuthenticated,
  authorizeRole,
};