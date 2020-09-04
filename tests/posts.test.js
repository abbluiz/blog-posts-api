const request = require('supertest');
const faker = require('faker');
const _ = require('lodash');
const arraySort = require('array-sort');

const tests = require('../src/utils/tests');

const app = require('../src/app');

test('Should not allow empty tag query parameter', async () => {

    const expectedErrorObject = {

        msg: 'tags parameter is required',
        param: 'tags',
        location: 'query'

    };

    const response = await request(app).get('/api/posts').send()
        .expect(400);

    expect(response.body.errors).toContainEqual(expectedErrorObject);

});

test('Should not allow invalid sortBy parameter', async () => {

    const randomWord = faker.lorem.word();

    const expectedErrorObject = {

        value: randomWord,
        msg: 'sortBy parameter is invalid',
        param: 'sortBy',
        location: 'query'

    };

    const response = await request(app).get('/api/posts?tags=tech&sortBy=' + randomWord).send()
        .expect(400);

    expect(response.body.errors).toContainEqual(expectedErrorObject);

});

test('Should not allow invalid direction parameter', async () => {

    const randomWord = faker.lorem.word();

    const expectedErrorObject = {

        value: randomWord,
        msg: 'direction parameter is invalid',
        param: 'direction',
        location: 'query'

    };

    const response = await request(app).get('/api/posts?tags=tech&direction=' + randomWord).send()
        .expect(400);

    expect(response.body.errors).toContainEqual(expectedErrorObject);

});

test('Should fetch blog posts sorted by ascending id (default)', async () => {

    const response = await request(app).get('/api/posts?tags=tech').send()
        .expect(200);

    expect(tests.isSortedAscBy(response.body.posts, 'id')).toBe(true);

});

test('Should fetch blog posts sorted by descending id', async () => {

    const response = await request(app).get('/api/posts?tags=tech&sortBy=id&direction=desc').send()
        .expect(200);

    expect(tests.isSortedDescBy(response.body.posts, 'id')).toBe(true);

});

test('Should fetch blog posts sorted by ascending reads', async () => {

    const response = await request(app).get('/api/posts?tags=tech&sortBy=reads').send()
        .expect(200);

    expect(tests.isSortedAscBy(response.body.posts, 'reads')).toBe(true);

});

test('Should fetch blog posts sorted by descending reads', async () => {

    const response = await request(app).get('/api/posts?tags=tech&sortBy=reads&direction=desc').send()
        .expect(200);

    expect(tests.isSortedDescBy(response.body.posts, 'reads')).toBe(true);

});

test('Should fetch blog posts sorted by ascending likes', async () => {

    const response = await request(app).get('/api/posts?tags=tech&sortBy=likes').send()
        .expect(200);

    expect(tests.isSortedAscBy(response.body.posts, 'likes')).toBe(true);

});

test('Should fetch blog posts sorted by descending likes', async () => {

    const response = await request(app).get('/api/posts?tags=tech&sortBy=likes&direction=desc').send()
        .expect(200);

    expect(tests.isSortedDescBy(response.body.posts, 'likes')).toBe(true);

});

test('Should fetch blog posts sorted by ascending popularity', async () => {

    const response = await request(app).get('/api/posts?tags=tech&sortBy=popularity').send()
        .expect(200);

    expect(tests.isSortedAscBy(response.body.posts, 'popularity')).toBe(true);

});

test('Should fetch blog posts sorted by descending popularity', async () => {

    const response = await request(app).get('/api/posts?tags=tech&sortBy=popularity&direction=desc').send()
        .expect(200);

    expect(tests.isSortedDescBy(response.body.posts, 'popularity')).toBe(true);

});

test('Should combine posts from multiple tags and remove duplicates', async () => {

    const responseForTechPosts = await request(app).get('/api/posts?tags=tech').send();

    const responseForHistoryPosts = await request(app).get('/api/posts?tags=history').send();

    const responseForTechAndHistoryPosts = await request(app).get('/api/posts?tags=tech,history').send()
        .expect(200);
    
    const combinedPosts = responseForTechPosts.body.posts.concat(responseForHistoryPosts.body.posts);
    const sortedPosts = _.sortedUniqBy(arraySort(combinedPosts, 'id', {reverse: false}), 'id');

    expect(JSON.stringify(sortedPosts)).toBe(JSON.stringify(responseForTechAndHistoryPosts.body.posts));

});