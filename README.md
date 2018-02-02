# azure-chaos-fn

[![Build Status](https://travis-ci.org/bengreenier/azure-chaos-fn.svg?branch=master)](https://travis-ci.org/bengreenier/azure-chaos-fn)

> To scaffold projects more easily, see [generator-azure-chaos-fn](https://github.com/bengreenier/generator-azure-chaos-fn). :sparkles:

The base module for all [azure-chaos](https://github.com/bengreenier/azure-chaos) extensions :gear: :robot_face:

![readme logo](https://github.com/bengreenier/azure-chaos-fn/raw/master/readme_logo.gif)

This module defines a `javascript` framework that is helpful when authoring [azure-chaos](https://github.com/bengreenier/azure-chaos) functions. It provides a lightweight processing pipeline that allows extension authors to more easily engineer chaos, without worrying about communication details with the orchestrator.

## API

> __If your functions are `async` they should return a `Promise`!__

Current version is `v1` - access it with `require('azure-chaos-fn/v1')` or `require('azure-chaos-fn').v1`.

## start.bootStrap

`Function` that bootstraps the request to start chaos. Should be given `context` (from azure functions) and `func` (the function to run).

Example:

```
const yourFunc = require('./your-func')
bootStrap(context, yourFunc)
```

## stop.bootStrap

`Function` that bootstraps the request to stop chaos. Should be given `context` (from azure functions) and `func` (the function to run).

Example:

```
const yourFunc = require('./your-func')
bootStrap(context, yourFunc)
```

### ChaosRequest

Represents a request

#### accessToken

`String` - the access token to use when issuing requests to azure

#### resourceIds

`Array` of [ChaosResourceId](#chaosresourceid)s

### ChaosResponse

#### status

`Function` that takes a `status` (a Number) and optionally a `desc` (a String) that describe the result of the request for chaos. 

Example:

```
res.status(200, JSON.stringify({status: 'all good'}))
```

#### end

`Function` that locks the response, indicating it's ready to be sent and will have no more action taken upon it. This can only be called once.

#### wasEnded

`Bool` that indicates if [end](#end) was called.

### ChaosResourceId

Represents the tri-part `resourceIds` that are passed in a `ChaosRequest`.

#### subscription

`String` - the subscription id

#### resourceId

`String` - the resource id

#### resourceGroup

`String` - The resource group

## License

MIT