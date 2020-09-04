const express = require('express');

const router = new express.Router();

router.get('/api/ping', async (request, response) => {

    try {

        response.send({
            success: true
        });

    } catch (error) {
        response.status(500).send(error);
    }

});

module.exports = router;