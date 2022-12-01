const { addTask, executeTasks } = require("../model/services");
const amqp = require('amqplib/callback_api');

module.exports = {
    add_task: async (req, res) => {
        try {
            if (req.body.priority >= 1 && req.body.priority <= 3) {
                amqp.connect('amqp://localhost', function (error0, connection) {
                    if (error0) {
                        throw error0;
                    }
                    connection.createChannel(function (error1, channel) {
                        if (error1) {
                            throw error1;
                        }

                        var queue = 'jobsQ';
                        var msg = 'Hello World!';

                        channel.assertQueue(queue, {
                            durable: false
                        });
                        channel.sendToQueue(queue, Buffer.from(JSON.stringify(req.body)));
                    });
                });
                return res.status(200).json(
                    {
                        msg: "Record Added Successfully",
                    }
                )
            } else {
                return res.status(200).json(
                    {
                        msg: "Priority is mandatory feild and it should be between 1 to 3.",
                    }
                )
            }


        } catch (error) {
            console.log(error);
        }
    },
    execute_jobs: async (req, res) => {
        try {
            console.log(req.query.type);
            let getList = await Promise.all([executeTasks(req.query.type)]);
            let jobsArry = getList[0]
            let text = ""
            for (let i = 0; i < jobsArry.length; i++) {
                if (i == 0) {
                    text += jobsArry[i]
                } else {
                    text += ", " + jobsArry[i]
                }
            }
            return res.status(200).json(
                {
                    msg: "Record Fetched Successfully",
                    text: text,
                    data: getList[0],
                }
            )
        } catch (error) {
            console.log(error);
        }
    }
}