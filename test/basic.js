const assert = require('assert')
const index = require('../')
const v1 = index.v1

describe('v1', () => {
    it('should expose globals', () => {
        assert.ok(v1.ChaosRequest)
        assert.ok(v1.ChaosResponse)
        assert.ok(v1.ChaosResourceId)
        assert.ok(v1.start)
        assert.equal(typeof v1.start, 'object')
        assert.equal(typeof v1.stop, 'object')
        assert.equal(typeof v1.start.bootStrap, 'function')
        assert.equal(typeof v1.stop.bootStrap, 'function')
    })

    describe('ChaosResourceId', () => {
        it('parses properly', () => {
            assert.throws(() => {
                new v1.ChaosResourceId(1)
            })

            assert.throws(() => {
                new v1.ChaosResourceId('')
            })

            assert.throws(() => {
                new v1.ChaosResourceId('one/two')
            })

            assert.throws(() => {
                new v1.ChaosResourceId('one/two/three/four')
            })

            const instance = new v1.ChaosResourceId('sub/rg/resource')

            assert.equal(instance.subscription, "sub")
            assert.equal(instance.resourceGroup, "rg")
            assert.equal(instance.resourceId, "resource")
        })
    })

    describe('ChaosRequest', () => {
        it('parses properly', () => {
            // invalid at
            assert.throws(() => {
                new v1.ChaosRequest({
                    req: {
                        body: {
                            accessToken: 1
                        }
                    }
                })
            })

            // empty resourceIds
            assert.throws(() => {
                new v1.ChaosRequest({
                        req: {
                            body: {
                            accessToken: "valid type",
                            resourceIds: []
                        }
                    }
                })
            })

            // invalid resourceIds type
            assert.throws(() => {
                new v1.ChaosRequest({
                    req: {
                        body: {
                            accessToken: "valid type",
                            resourceIds: [
                                1
                            ]
                        }
                    }
                })
            })

            // invalid resourceIds format
            assert.throws(() => {
                new v1.ChaosRequest({
                    req: {
                        body: {
                            accessToken: "valid type",
                            resourceIds: [
                                "valid type"
                            ]
                        }
                    }
                })
            })

            // valid
            const expectedAccessToken = "12345234r2"
            const expectedResourceIds = ["sub/rg/resource"]
            const instance = new v1.ChaosRequest({
                req: {
                        body: {
                        accessToken: expectedAccessToken,
                        resourceIds: expectedResourceIds
                    }
                }
            })

            assert.equal(instance.accessToken, expectedAccessToken)
            assert.ok(instance.resourceIds[0] instanceof v1.ChaosResourceId)
        })
    })

    describe('ChaosResponse', () => {
        it('serializes properly', () => {
            const ctx = {res: {}}
            const instance = new v1.ChaosResponse(ctx)

            instance.status(200, 'pie')

            assert.equal(instance.wasEnded, false)
            assert.equal(typeof ctx.res.status, 'undefined')
            assert.equal(typeof ctx.res.body, 'undefined')

            instance.end()

            assert.equal(ctx.res.status, 200)
            assert.equal(ctx.res.body, 'pie')
            assert.equal(instance.wasEnded, true)

            assert.throws(() => {
                instance.status(200)
            })
        })

        it('serializes properly (without body)', () => {
            const ctx = {res: {}}
            const instance = new v1.ChaosResponse(ctx)

            instance.status(200)

            assert.equal(instance.wasEnded, false)
            assert.equal(typeof ctx.res.status, 'undefined')
            assert.equal(typeof ctx.res.body, 'undefined')
            
            instance.end()

            assert.equal(ctx.res.status, 200)
            assert.ok(!ctx.res.body)
            assert.equal(instance.wasEnded, true)

            assert.throws(() => {
                instance.status(200)
            })
        })
    })
})