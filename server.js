const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const users = require('./models/users');

const application = express();

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/activityApplication');

application.use(bodyParser.json());

application.post('/api/users', async (request, response) => {
    var name = request.body.name;
    var password = request.body.password;
    var email = request.body.email;
    var userList = await getUsers();

    var createUser = await users.create({
        name: name,
        password: password,
        email: email
    });

    response.json("Successfully added user");
});

// LIST ACTIVITIES

application.get('/api/users/:userId/activities', async (request, response) => {
    var singleUser = await users.find({ _id: request.params.userId });
    response.json(singleUser[0].activities);
});

// ADD ACTIVITIES

application.post('/api/users/:userId/activities', async (request, response) => {
    var activityName = request.body.activityName;
    var singleUser = await users.find({ _id: request.params.userId });

    var addActivity = await singleUser[0].activities.push({ activityName: activityName });
    var save = singleUser[0].save();

    response.json(singleUser[0].activities);
});

// GET ONE ACTIVITY

application.get('/api/users/:userId/activities/:activityId', async (request, response) => {
    var activityId = request.params.activityId;

    var singleUser = await users.find({ _id: request.params.userId });

    function findActivity(activity) {
        return activity._id == activityId;
    }

    var singleActivity = await singleUser[0].activities.find(findActivity);

    response.json(singleActivity);
});

// UPDATE ONE ACTIVITY NAME

application.put('/api/users/:userId/activities/:activityId', async (request, response) => {
    var activityId = request.params.activityId;

    var singleUser = await users.find({ _id: request.params.userId });

    function findActivity(activity) {
        return activity._id == activityId;
    }

    var singleActivity = await singleUser[0].activities.find(findActivity);
    
    singleActivity.activityName = request.body.activityName;
    response.json(singleActivity);
});

// DELETE ONE ACTIVITY

application.delete('/api/users/:userId/activities/:activityId', async (request, response) => {
    var activityId = request.params.activityId;

    var singleUser = await users.find({ _id: request.params.userId });

    function findActivity(activity) {
        return activity._id == activityId;
    }

    var activityindex = await singleUser[0].activities.findIndex(findActivity);

    var deleteActivity = singleUser[0].activities.splice(activityindex, 1);

    response.json(singleUser[0].activities);
});

// GET STATS FOR ONE ACTIVITY

application.get('/api/users/:userId/activities/:activityId/stats', async (request, response) => {
    var activityId = request.params.activityId;

    var singleUser = await users.find({ _id: request.params.userId });

    function findActivity(activity) {
        return activity._id == activityId;
    }

    var singleActivity = await singleUser[0].activities.find(findActivity);

    response.json(singleActivity.stats)
});

// ADD STATS FOR ONE ACTIVITY

application.post('/api/users/:userId/activities/:activityId/stats', async (request, response) => {
    var activityId = request.params.activityId;

    var singleUser = await users.find({ _id: request.params.userId });

    function findActivity(activity) {
        return activity._id == activityId;
    }

    var singleActivity = await singleUser[0].activities.find(findActivity);

    var date = request.body.date;
    var statAmount = request.body.statAmount;
    function findStat(stat) {
        return stat.date == date;
    }

    var statFind = singleActivity.stats.findIndex(findStat);

    if(statFind != -1) {
        singleActivity.stats[statFind] = {date: date, statAmount: statAmount};
    } else {
        singleActivity.stats.push({date: date, statAmount: statAmount});
    }

    var save = singleUser[0].save();

    response.json(singleActivity.stats)
});

// DELETE ONE STAT FOR ONE ACTIVITY

application.delete('/api/users/:userId/activities/:activityId/stats/:statId', async (request, response) => {
    var activityId = request.params.activityId;
    var statId = request.params.statId;
    var singleUser = await users.find({ _id: request.params.userId });

    function findActivity(activity) {
        return activity._id == activityId;
    }

    var singleActivity = await singleUser[0].activities.find(findActivity);

    function findStat(stat) {
        return stat._id == statId;
    }

    var statIndex = singleActivity.stats.findIndex(findStat);

    var deleteStat = singleActivity.stats.splice(statIndex, 1);

    var save = singleUser[0].save();

    response.json(singleActivity.stats)
});


application.listen(3000);