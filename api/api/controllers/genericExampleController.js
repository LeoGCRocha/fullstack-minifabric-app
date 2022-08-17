'use strict'

const fs = require('fs')
const exec = require('child_process').execSync
const path = require('path')
const minifabricPath = '/home/lgcrocha/dev/generic-example/'

module.exports = () => {
    const controller = {}
    // POST
    controller.submit = (req, res, next) => {
        var params = {
            'op': 'input'
        }
        console.log(req)
    }
    // GET
    controller.read = (req, res, next) => {
        const bodyParams = req.query
        let params = {
            'op': 'read',
            'ID': bodyParams.ID
        }
        // DEFINE OPTIONS TO MINIFABRIC
        fs.writeFileSync(minifabricPath + 'vars/app/node/options.json', JSON.stringify(params), function(err) {
            if (err) {
                return next()
            }
        })
        // MINIFABRIC FUNCTION
        try {

        } catch (error) {
            return next(res.status(400).json({
                "message": "Cannot resolve the route.",
                "success": false
            }))
        }
        let json = JSON.parse(fs.readFileSync(minifabricPath + 'vars/app/node/data/output.json'))
        res.status(200).json({
            "message": 'Successful',
            "success": true,
            "result": json
        })
    }
    return controller
}
