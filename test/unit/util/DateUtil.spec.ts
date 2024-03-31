import { describe, it, expect, beforeEach } from 'vitest'
import { DateUtil } from '~/util/DateUtil'

describe('DateUtil', () => {
    it('toDateOnlyString', () => {
        const date = new Date('2024-03-29T08:00:00')
        expect(DateUtil.toDateOnlyString(date)).toBe('29 Mar')
    })

    it('getMinutesDiff', () => {
        const date1 = new Date('2024-03-29T08:00:00')
        const date2 = new Date('2024-03-29T09:00:00')
        expect(DateUtil.getMinutesDiff(date1, date2)).toBe(60)
    })
})
