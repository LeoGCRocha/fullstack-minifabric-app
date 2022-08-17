'use strict'

const fs = require('fs')
const exec = require('child_process').execSync
const path = require('path')
const minifabricPath = '/home/lgcrocha/dev/generic-example/'

module.exports = () => {
    const controller = {}
    // POST
    controller.submit = (req, res, next) => {
        let startTime = performance.now()
        const bodyParams = req.query
        var params = {
            'op': 'input',
            'ID': bodyParams.ID,
            'Name': bodyParams.Name
        }
        let beforeScript = performance.now()
        console.log("Debug Informations (Submit Function)")
        console.log(`Time to run application before script executation: ${(beforeScript - startTime) / 1000} seconds.`)
        // DEFINE OPTIONS TO MINIFABRIC
        fs.writeFileSync(minifabricPath + 'vars/app/node/options.json', JSON.stringify(params), function (err) {
            if (err) {
                return next()
            }
        })
        // MINIFABRIC FUNCTION
        try {
            exec(`sh ${path.resolve(__dirname, '..', 'minifabric', 'minifabric.sh')}`, { stdio: [] })
        } catch (error) {
            return next(res.status(400).json({
                "message": "Cannot resolve the route.",
                "success": false
            }))
        }
        let afterScript = performance.now()
        console.log(`Time to run application after script executation: ${(afterScript - startTime) / 1000} seconds.`)
        res.status(200).json({
            "message": 'Successful',
            "success": true
        })
    }
    // GET
    controller.read = (req, res, next) => {
        let startTime = performance.now()
        const bodyParams = req.query
        let params = {
            'op': 'read',
            'ID': bodyParams.ID
        }
        let beforeScript = performance.now()
        console.log("Debug Informations (Read Function)")
        console.log(`Time to run application before script executation: ${(beforeScript - startTime)/1000} seconds.`)
        // DEFINE OPTIONS TO MINIFABRIC
        fs.writeFileSync(minifabricPath + 'vars/app/node/options.json', JSON.stringify(params), function(err) {
            if (err) {
                return next()
            }
        })
        // MINIFABRIC FUNCTION
        try {
            exec(`sh ${path.resolve(__dirname, '..', 'minifabric', 'minifabric.sh')}`, {stdio: []})
        } catch (error) {
            return next(res.status(400).json({
                "message": "Cannot resolve the route.",
                "success": false
            }))
        }
        let afterScript = performance.now()
        console.log(`Time to run application after script executation: ${(afterScript - startTime) / 1000} seconds.`)
        let json = JSON.parse(fs.readFileSync(minifabricPath + 'vars/app/node/data/output.json'))
        res.status(200).json({
            "message": 'Successful',
            "success": true,
            "result": json
        })
    }
    return controller
}
