const express = require('express');
const { add_task, execute_jobs } = require('../controller/services');
const router = express.Router();

router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.post('/add-task', add_task)
router.get('/execute-jobs', execute_jobs)


module.exports = router;