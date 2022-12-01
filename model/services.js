const sequelize = require('./mysqlConnection');
const redisClient = require('./redisConnection')
const { DataTypes } = require('sequelize');
const Job = sequelize.define("Jobs", {
    jobname: DataTypes.STRING,
    priority: DataTypes.INTEGER,
    dependency: DataTypes.INTEGER,
    inputType: DataTypes.STRING,
});
module.exports = {
    addTasks: async (jobData) => {
        const jane = await Job.create({ jobname: jobData.jobname, dependency: jobData.dependency, priority: jobData.priority, inputType: jobData.inputType });
        const users = await Job.findAll();
        const redisValue = JSON.stringify(users);
        const arr = JSON.parse(redisValue)
        arr.sort(function (a, b) { return a.priority - b.priority; });
        let tempArry = []
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].dependency) {
                for (let j = 0; j < arr.length; j++) {
                    if (arr[j].id == arr[i].dependency) {
                        tempArry.push(arr[j], arr[i])
                        arr.splice(j, 1)
                        break
                    }
                }
            } else {
                tempArry.push(arr[i])
            }
        }
        redisClient.set('jobs', JSON.stringify(tempArry), function (err, reply) {
            console.log(reply);
        });
    },
    executeTasks: async (keyName) => {
        let getCacheData = await redisClient.get(keyName)
        let getCacheDataArry = JSON.parse(getCacheData)
        let finalArry = []
        for (let i = 0; i < getCacheDataArry.length; i++) {
            finalArry.push(getCacheDataArry[i].jobname)
        }
        return finalArry
    }
}