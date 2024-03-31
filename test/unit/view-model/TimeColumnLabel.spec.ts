import { describe, it, expect, beforeEach } from 'vitest'
import { AllocTimeColLabel } from '~/types/common-type'
import { TimeColumnLabel } from '~/view-model/TimeColumnLabel'

describe('TimeColumnLabel', () => {
    let time_column_label: TimeColumnLabel
    let date_range: Array<AllocTimeColLabel>
    beforeEach(() => {
        date_range = [
            {
                date: '2024-03-30',
                hours: [],
            },
        ]
        time_column_label = new TimeColumnLabel(date_range)
    })
    it('constructor', () => {
        expect(time_column_label instanceof TimeColumnLabel).toBe(true)
    })

    it('getTotalNumberOfTimeColumns', () => {
        expect(time_column_label.getTotalNumberOfTimeColumns()).toBe(0)
    })

    it('getAllDates', () => {
        expect(time_column_label.getAllDates()).toStrictEqual([
            {
                vKey: 'date-header-2024-03-30',
                label: '2024-03-30',
                colSpan: 0,
            },
        ])
    })

    it('getAllHours', () => {
        expect(time_column_label.getAllHours()).toStrictEqual([])
    })

    it('getAllMinutes', () => {
        expect(time_column_label.getAllMinutes()).toStrictEqual([])
    })
})
