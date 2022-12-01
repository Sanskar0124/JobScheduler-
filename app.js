var createError = require('http-errors');
var express = require('express');
const bodyParser = require('body-parser')
var serviceRoute = require('./routes/services');
const amqp = require('amqplib/callback_api');
const cookieParser = require('cookie-parser');
const { addTasks } = require('./model/services');
var app = express();
const port = 3000
app.use(bodyParser.json())
app.use(cookieParser())


// Routes
app.use('/service', serviceRoute);

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'jobsQ';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async function (msg) {
            jobData = JSON.parse(msg.content);
            console.log(" [x] Received %s", msg.content.toString());
            try {
                let getList = await Promise.all([addTasks(jobData)]);
            } catch (error) {
                console.log(error);
            }


            // console.log(JSON.parse(array));
        }, {
            noAck: true
        });
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
module.exports = app;
