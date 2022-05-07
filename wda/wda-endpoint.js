module.exports = function(RED) {
    'user strict';

    function WdaEndpointNode(config) {
        RED.nodes.createNode(this, config);
        this.hostname = config.hostname;        
        this.insecure = config.insecure;
    }

    RED.nodes.registerType('wda-endpoint', WdaEndpointNode, {
        credentials: {
            username: { type: 'text' },
            password: { type: 'password' }
        }
    });
};