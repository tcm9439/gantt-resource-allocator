import { describe, it, expect, beforeEach } from 'vitest'
import { ElementPosition } from '~/util/ElementPosition'

describe('ElementPosition', () => {
    let ep: ElementPosition
    beforeEach(() => {
        ep = new ElementPosition()
    })

    it('constructor', () => {
        expect(ep instanceof ElementPosition).toBe(true)
    })

    it('x', () => {
        ep.setX(10)
        expect(ep.x()).toBe(10)
    })

    it('setX', () => {
        ep.setX(10)
        expect(ep.x()).toBe(10)
    })

    it('y', () => {
        ep.setY(10)
        expect(ep.y()).toBe(10)
    })

    it('setY', () => {
        ep.setY(10)
        expect(ep.y()).toBe(10)
    })

    it('toString', () => {
        expect(ep.toString()).toBe('[x: 0, y: 0]')
    })

    it('equals', () => {
        const ep2 = new ElementPosition(15, 15)
        expect(ep.equals(ep2)).toBe(false)

        ep.setX(15)
        ep.setY(15)
        expect(ep.equals(ep2)).toBe(true)
    })
})
