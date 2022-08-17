'use strict'

module.exports = app => {
    const controller = app.controllers.genericExampleController; 
    app.route('/api/genericExample/submit').post(controller.submit)
    app.route('/api/genericExample/read').get(controller.read)
}