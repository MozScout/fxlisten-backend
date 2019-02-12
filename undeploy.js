'use strict';

const async = require('async');
const exec = require('child_process').exec;

function undeploy() {
  const services = [
    'article',
    'authorizer',
    'login',
    'register',
    'subscriptionList',
    'subTopicList',
    'summary',
    'topicList',
    'topics'
  ];
  let cmd = '';
  async.eachSeries(
    services,
    (service, nextService) => {
      console.log(`Undeploying ${service} service...`);
      cmd = `cd ./api/${service} && npm run undeploy && rm -rf .serverless`;
      exec(cmd, (error, stdout, stderr) => {
        if (error) console.log(error);
        nextService();
      });
    },
    function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('All services successfully removed.');
      }
    }
  );
}

undeploy();
