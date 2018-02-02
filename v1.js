const assert = require('assert')

class ChaosResourceId {
    constructor(str) {
        assert.ok(typeof str, 'string')

        const parts = str.split('/')

        assert.ok(parts.length === 3)

        this._subscription = parts[0]
        this._resourceGroup = parts[1]
        this._resourceId = parts[2]
    }

    get subscription() {
        return this._subscription
    }

    get resourceGroup() {
        return this._resourceGroup
    }

    get resourceId() {
        return this._resourceId
    }
}

class ChaosRequest {
    constructor(context) {
        this._context = context

        const body = this._context.req.body
        
        assert.equal(typeof body.accessToken, 'string')
        assert.ok(body.resourceIds.length > 0)

        this._accessToken = body.accessToken
        this._resourceIds = body.resourceIds.map(str => new ChaosResourceId(str))
    }

    get context() { 
        return this._context
    }

    get accessToken() {
        return this._accessToken
    }

    get resourceIds() {
        return this._resourceIds
    }
}

class ChaosResponse {
    constructor(context) {
        this._context = context
        this._wasEnded = false
        this._status = 500
        this._statusDesc = null
    }

    get wasEnded() {
        return this._wasEnded
    }

    get context() { 
        return this._context
    }

    status(code, desc) {
        if (this._wasEnded) {
            throw new Error('Request already closed')
        }

        this._status = code

        if (desc) {
            this._statusDesc = desc
        }
    }

    end() {
        if (this._wasEnded) {
            throw new Error('Request already closed')
        }

        this._context.res = {
            status: this._status,
            body: this._statusDesc
        }

        this._wasEnded = true
    }
}

const endpointBootStrap = (context, fn) => {
    // ensure v1
    if (!context.headers.accept || !context.headers.accept.startsWith('application/vnd.azure-chaos.1')) {
        context.res = {
            status: 500,
            body: `invalid api version. Accept: '${context.headers.accept}'`
        }

        return
    }

    let res = new ChaosResponse(context)
    let result
    
    try {
        result = fn(new ChaosRequest(context), res)
    } catch (ex) {
        res.status(500, ex)
    }

    // if the fn yields a promise, we can't help them
    // they must call res.end() when they are complete
    if (result instanceof Promise) {
        return
    }

    if (!res.wasEnded) {
        res.end()
    }

    return result
}

module.exports = {
    start: {
        bootStrap: endpointBootStrap
    },
    stop: {
        bootStrap: endpointBootStrap
    },
    ChaosRequest,
    ChaosResponse,
    ChaosResourceId
}