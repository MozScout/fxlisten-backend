# FxListen Backend

## Overview

The FxListen backend is powered by the [Serverless Framework](http://serverless.com). The application makes use of the following AWS services:

* [API Gateway](https://aws.amazon.com/api-gateway/)
* [Lamdba](https://aws.amazon.com/lambda/)
* [DynamoDB](https://aws.amazon.com/dynamodb)

Each service makes use of **@fxlisten/core**, a private npm module and shared library stored in the "core" folder.

## Local Development

1. **Install Node.js**. 

  Download: http://nodejs.org/download/


3. **Install The Serverless Framework**.

  ```
  $ npm install serverless -g
  ```  

3. **Install project dependencies**. Each service is a stand-alone Node.js application. Currently, the "api" folder contains all services. To install npm dependencies for each services, cd into the api/[service] folder and type the following:

  ```
  $ npm install
  ```

## Configuring AWS credentials

Before working with serverless, you'll need to create an IAM user on AWS with admin access. Then run the following command:

```
serverless config credentials --provider aws --key <your-aws-key> --secret <your-aws-secret> 
```

## Running Local Environment via Serverless Offline

To start a services, cd into the service's folder and type:


  ```
  $ npm start
  ```

## Deploying Manually

To deploy services to AWS, cd into each service's folder and type:


  ```
  $ npm run deploy
  ``` 

## Undeploying Manually

To undeploy the backend from AWS, cd into each service's folder and type:

  ```
  $ npm run undeploy
  ``` 

## Pushing Code

Before submitting pull requests, run the following command to beautify your code:

  ```
  npm run prettier:write
  ```

## Continuous Integration

Our continuous integration pipeline runs on [Seed](http://seed.run).






