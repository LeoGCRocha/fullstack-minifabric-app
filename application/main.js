'use strict'
const { Gateway, Wallets } = require('fabric-network')
const fs = require('fs')
const path = require('path')
const option = require('./data/options.json')

import {updateAccount, readAccount} from './genericExample'

function writeFileSync(path, result) {
    fs.writeFileSync(path, result, function (err) {
        if (err) {
            console.log("cannot save the file.")
        } else {
            console.log("the file was saved!");
        }
    });
}

// network params
let orgname = 'org0.example.com'
let channelname = 'mychannel' 

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join('/vars/profiles/vscode/wallets', orgname);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('Admin');
        if (!identity) {
            console.log('Admin identity can not be found in the wallet');
            return;
        }
        // Network definitions
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'Admin', discovery: { enabled: true, asLocalhost: false } });
        const network = await gateway.getNetwork(channelname);
        const contract = network.getContract('genericExample')
        // Option
        switch (option['op']) { // from configuration file
            case "input": {
                updateAccount(contract, option['ID'], option['Name'])
            }
            case "read": {
                let result = readAccount(contract, option['ID'])
                // save result in a file
                writeFileSync("./data/output.json", result)
                break
            }
            default:
                console.log("Error: invalid option.")
        }
        // Disconnect from the gateway.
        gateway.disconnect();
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1)
    }
}
main();
