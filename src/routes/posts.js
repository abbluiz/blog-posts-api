const express = require('express');
const { query, validationResult } = require('express-validator');
const arraySort = require('array-sort');
const _ = require('lodash');

const externalApi = require('../utils/external-api');
const cache = require('../middleware/cache');

const router = new express.Router();

const sortableFields = ['id', 'reads', 'likes', 'popularity'];
const acceptableSortDirections = ['asc', 'desc'];

router.get('/api/posts', cache.get, [

    query('tags', 'tags parameter is required').exists(),
    query('sortBy', 'sortBy parameter is invalid').optional().isIn(sortableFields),
    query('direction', 'direction parameter is invalid').optional().isIn(acceptableSortDirections)

], async (request, response, next) => {

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
    }

    const tags = request.query.tags.split(',');
    const sortBy = request.query.sortBy || 'id';
    const direction = request.query.direction || 'asc';

    let allPosts = [];

    try {

        await Promise.all(tags.map(async (tag) => {

            await externalApi(tag, (errorMessage, { posts } = {}) => {

                if (errorMessage) {
                    throw new Error(errorMessage);
                }
    
                let auxiliaryArray = [...allPosts];
                allPosts = auxiliaryArray.concat(posts);
    
            });

        }));

        const sortedPosts = arraySort(allPosts, sortBy, { reverse: direction === 'asc' ? false : true });
        const uniquePosts = _.sortedUniqBy(sortedPosts, 'id');

        response.locals.data = { posts: uniquePosts };
        response.send(response.locals.data);

        next();

    } catch (error) {
        response.status(500).send({error: error.message});
    }

}, cache.set);

module.exports = router;