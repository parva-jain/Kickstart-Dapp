const routes = require('next-routes')()

// Restart server after adding routes
routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', 'campaigns/requests/new')

module.exports = routes