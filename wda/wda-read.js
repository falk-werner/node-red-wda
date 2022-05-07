module.exports = function(RED) {
    'use strict';

    const { wdaRead } = require('./wda');

    function WdaReadNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var endpoint = RED.nodes.getNode(config.endpoint);

        node.on('input', function(msg) {

            wdaRead({
                hostname: endpoint.hostname,
                username: endpoint.credentials.username,
                password: endpoint.credentials.password,
                insecure: endpoint.insecure,
                device: config.device,
                collection: config.collection,
                parameter: config.parameter
            })
            .then((data) => {
                msg.payload = data;
                node.send(msg);    
            })
            .catch((err) => {
                node.send(err);
            });
        });
    }

    RED.nodes.registerType("wda-read", WdaReadNode);
};