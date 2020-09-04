const axios = require('axios');

const externalApi = async (tag, callback) => {

    const url = 'https://hatchways.io/api/assessment/blog/posts?tag=' + tag;

    try {

        const response = await axios.get(url);
        callback(undefined, {
            posts: response.data.posts
        });

    } catch (error) {
        callback(error, undefined);
    }

};

module.exports = externalApi;