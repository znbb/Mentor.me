'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Articles Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['student', 'mentor'],
    allows: [{
      resources: '/api/messages/:messageId',
      permissions: ['get', 'post']
    }, {
      resources: '/api/messages',
      permissions: ['get', 'post']
    }, {
      resources: '/api/messages/create/:recipientId',
      permissions: ['get', 'post']
    }]
  }]);
};
/**
 * Check If Articles Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  /*if (req.params.userId !== req.user.id) {
    return res.status(403).send('User is not authorized');
  }*/

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
