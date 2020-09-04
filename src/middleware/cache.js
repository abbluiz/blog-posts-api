const NodeCache = require('node-cache');

// Cache will stay for 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

const getUrlFromRequest = (request) => {

    const url = request.protocol + '://' + request.headers.host + request.originalUrl;
    return url;

};

const set = (request, response, next) => {

    const url = getUrlFromRequest(request);
    cache.set(url, response.locals.data);
    return next();

};

const get = (request, response, next) => {

    const url = getUrlFromRequest(request);
    const data = cache.get(url);

    if (data) {
        return response.status(200).send(data);
    }

    return next();

};

module.exports = { get, set };