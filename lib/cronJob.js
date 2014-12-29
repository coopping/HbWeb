'use strict';

var CronJob = require('cron').CronJob;
var Logger = require('../lib/logger');
var Task = require('../controllers/webservices/job/task');

var cronJob = function() {
    return {
        config: function(config) {
            var job = new CronJob(config.cron, function() {                    
                    Task.agentInfo();
                    Task.productInfo();
                    Task.contractInfo();
                    Task.providerInfo();
                    Task.deleteAccessToken();
                }, function() {
                    // This function is executed when the job stops
                    Logger.debug('删除过期access token和SecuURL执行完毕，应该不会执行到这里');
                },
                true /* Start the job right now */
            );
        }
    }
};

module.exports = cronJob();