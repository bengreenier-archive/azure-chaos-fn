# azure-chaos-fn

[![Build Status](https://travis-ci.org/bengreenier/azure-chaos-fn.svg?branch=master)](https://travis-ci.org/bengreenier/azure-chaos-fn)

A helper module for all `node` [azure-chaos](https://github.com/bengreenier/azure-chaos) extensions :gear: :robot:

![readme logo](https://github.com/bengreenier/azure-chaos-fn/raw/master/readme_logo.gif)

This module defines a `javascript` framework that is helpful when authoring [azure-chaos](https://github.com/bengreenier/azure-chaos) functions. It provides lightweight helpers that allow extension authors to more easily engineer chaos, without worrying about communication details with the orchestrator.

## API

This is the exported API from the `azure-chaos-fn` module.

### validators

Request validation helpers. Useful to ensure data coming in is behaving as expecting.

```
const validate = require('azure-chaos-fn/validators')
```

#### accessToken

Validates that the `body` of a `req` object contains a valid `accessToken`.

```
try { require('azure-chaos-fn/validators').accessToken(req) } catch (ex) { console.error(`error: ${ex}`) }
```

#### resources

Validates that the `body` of a `req` object contains a valid `resources` array.

```
try { require('azure-chaos-fn/validators').resources(req) } catch (ex) { console.error(`error: ${ex}`) }
```

### parsers

> Note: these depend on the [validators](#validators) to ensure only valid data is parsed.

Request parser helpers. Useful to parse valid request data into models.

```
const parsers = require('azure-chaos-fn/parsers')
```

#### accessTokenToCredentials

Inflates the `accessToken` from a `req` objects `body` into a [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure) compatible   credentials object.

```
const credentials = require('azure-chaos-fn/parsers').accessTokenToCredentials(req)
```

#### resourcesToObjects

Inflates the `resources` from a `req` objects `body` into a collection of objects containing the following properties:

+ `subscriptionId` - the azure subscription id to target
+ `resourceGroupName` - the azure resource group name to target
+ `resourceName` - the azure resource name to target

```
const objs = require('azure-chaos-fn/parsers').resourcesToObjects(req)
```

## License

MIT