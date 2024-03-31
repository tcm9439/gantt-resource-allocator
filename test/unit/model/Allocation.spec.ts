import { describe, it, expect, beforeEach } from 'vitest'
import { Allocation } from '~/model/Allocation'
import { TimeRange } from '~/model/TimeRange'

describe('Allocation', () => {
    let allocation: Allocation
    beforeEach(() => {
        allocation = new Allocation('id', 'name')
    })

    it('constructor', () => {
        expect(allocation instanceof Allocation).toBe(true)
    })

    it('id', () => {
        expect(allocation.id()).toBe('id')
    })

    it('name', () => {
        expect(allocation.name()).toBe('name')
    })

    it('setTimeRange', () => {
        const timeRange = new TimeRange(new Date(), new Date())
        allocation.setTimeRange(timeRange)
        expect(allocation.timeRange()).toBe(timeRange)
    })

    it('timeRange', () => {
        const timeRange = new TimeRange(new Date(), new Date())
        allocation.setTimeRange(timeRange)
        expect(allocation.timeRange()).toBe(timeRange)
    })

    it('copy', () => {
        const start = new Date('2024-03-29T08:00:00')
        const end = new Date('2024-03-29T22:00:00')
        const timeRange = new TimeRange(start, end)
        allocation.setTimeRange(timeRange)
        const copy = allocation.copy()
        expect(copy instanceof Allocation).toBe(true)
        // compare timeRange.start to copy.start
        expect(copy.timeRange().start()).toStrictEqual(timeRange.start())
    })

    it('toDisplayString', () => {
        const date = new Date('2024-03-29T09:17:00')
        expect(Allocation.toDisplayString(date)).toStrictEqual('09:17')
    })

    it('hasCollision', () => {
        expect(allocation.hasCollision()).toBe(false)
    })

    it('addCollision', () => {
        allocation.addCollision()
        expect(allocation.hasCollision()).toBe(true)
    })

    it('removeCollision', () => {
        allocation.addCollision()
        allocation.removeCollision()
        expect(allocation.hasCollision()).toBe(false)
    })

    it('allowCollide', () => {
        expect(allocation.allowCollide()).toBe(false)
    })
})
