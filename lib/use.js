//
// For loading and using resources
//


module['exports'] = function (r, options) {

  var resource = require('../index'),
      helper = resource.helper;

  //
  // Load the resource as a node.js module
  //
  var _r = resource.load(r);

  //
  // If the required resource doesn't have the expected exported scope,
  // throw a friendly error message
  //
  if (typeof _r[r] === 'undefined') {
    throw new Error("exports." + r + " is not defined in the " + r + ' resource!')
  }

  //
  // Attach the name of the resource to the resource itself
  //
  _r.name = r;

  //
  // Default dependencies for resource
  //
  _r.dependencies = _r.dependencies || {};

  //
  // Any options passed into resource.use('foo', options),
  // will be considered configuration options, and bound to resource.config
  //
  _r[r].config = options || {};

  //
  // If a database configuration has been specified, attach CRUD methods to resource.
  // This adds methods such as Resource.create / Resource.get.
  // With a datasource specification, resources can persist.
  // Persisting resources requires an additional dependency of "jugglingdb"
  // see: github.com/1602/jugglingdb
  //
  if (typeof _r[r].config.datasource !== 'undefined') {
    resource.use('persistence');
    resource.persistence.enable(_r[r], _r[r].config.datasource);
  }

  //
  // Attach a copy of the resource to the resource module scope for later reference
  //
  resource[r] = _r[r];

  resource.resources[r] = _r[r];

  return _r[r];

};
