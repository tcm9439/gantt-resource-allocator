import { describe, it, expect, beforeEach } from 'vitest'
import { CollidedAllocation } from '~/model/CollidedAllocation'
import { Allocation } from '~/model/Allocation'
import { TimeRange } from '~/model/TimeRange'

describe('CollidedAllocation', () => {
    let collidedAllocation: CollidedAllocation
    let allocation_a: Allocation
    let allocation_b: Allocation
    beforeEach(() => {
        const a_start = new Date('2024-03-29T08:00:00')
        const a_end = new Date('2024-03-29T22:00:00')
        const a_time_range = new TimeRange(a_start, a_end)

        allocation_a = new Allocation('id', 'name', a_time_range)

        const b_start = new Date('2024-03-29T12:00:00')
        const b_end = new Date('2024-03-29T23:00:00')
        const b_time_range = new TimeRange(b_start, b_end)

        allocation_b = new Allocation('id', 'name', b_time_range)
        // they should be initially collided by constructor

        collidedAllocation = new CollidedAllocation(allocation_a, allocation_b)
    })

    it('constructor', () => {
        expect(collidedAllocation instanceof CollidedAllocation).toBe(true)
    })

    it('includes', () => {
        expect(collidedAllocation.includes(allocation_a)).toBe(true)
        expect(collidedAllocation.includes(allocation_b)).toBe(true)
    })

    it('removeCollisionCount', () => {
        expect(allocation_a.collisionCount).toBe(1)
        expect(allocation_b.collisionCount).toBe(1)

        collidedAllocation.removeCollisionCount()

        expect(allocation_a.collisionCount).toBe(0)
        expect(allocation_b.collisionCount).toBe(0)
    })

    it('collisionRemoved', () => {
        expect(collidedAllocation.collisionRemoved()).toBe(false)
        collidedAllocation.removeCollisionCount()
        expect(collidedAllocation.collisionRemoved()).toBe(true)
    })
})
