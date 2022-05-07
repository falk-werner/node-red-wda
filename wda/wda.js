const https = require('node:https');

const makePath = function(device, collection, parameter) {
    const basePath = '/wda/parameters';
    const unified_parameter = parameter.replace(/\//g, '-').toLowerCase();

    return basePath + '/' + collection + '-' + device + '-' + unified_parameter;
}

const wdaRead = function(options) {
    const hostname = options.hostname;
    const username = options.username || 'admin';
    const password = options.password;
    const rejectUnauthorized = (options.insecure === false);
    const device = options.device || 0;
    const collection = options.collection || 0;
    const parameter = options.parameter;

    const path = makePath(device, collection, parameter);

    return new Promise((resolve, reject) => {
        const options = {
            hostname: hostname,
            auth: username + ':' + password,
            port: 443,
            path: path,
            method: 'GET',
            rejectUnauthorized: rejectUnauthorized
        };
        const request = https.request(options, (response) => {
            if ((200 <= response.statusCode) && (response.statusCode < 300)) {
                
                let contents = '';
                response.on('data', (chunk) => {
                    contents += chunk;
                });

                response.on('end', () => {
                    let json = {};
                    try {
                        json = JSON.parse(contents);
                    }
                    catch (ex) {
                        reject(new Error('invalid json'));
                    }

                    resolve(json);

                });

            }
            else {
                reject({error: {statusCode: response.statusCode}});
            }

        });

        request.on('error', (error) => {
            reject(error);
        });

        request.end();

    });
};

module.exports = {
    wdaRead
};