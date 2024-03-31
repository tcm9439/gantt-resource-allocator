import { AllocTimeColLabel } from '~/types/common-type'
import { DateUtil } from '~/util/DateUtil'
import { StringUtil } from '~/util/StringUtil'

export class TimeRange {
    private _start: Date
    private _end: Date

    /**
     *
     * @param start date time
     * @param end date time
     */
    constructor(start: Date, end: Date) {
        this._start = start
        this._end = end
    }

    /**
     * check if a given date-time is within the time range
     * @param date_time
     * @returns
     */
    contains(date_time: Date): boolean {
        return date_time >= this._start && date_time <= this._end
    }

    /**
     * check if a given time range overlaps with this time range
     *
     * @param timeRange
     * @returns
     */
    overlapTimeRange(timeRange: TimeRange): boolean {
        return (
            this.contains(timeRange._start) ||
            this.contains(timeRange._end) ||
            timeRange.contains(this._start) ||
            timeRange.contains(this._end)
        )
    }

    /**
     * Checks if a given time range is completely within this time range.
     *
     * @param timeRange - The time range to check.
     * @returns `true` if the given time range is completely within this time range, `false` otherwise.
     */
    containsTimeRange(timeRange: TimeRange): boolean {
        return this.contains(timeRange._start) && this.contains(timeRange._end)
    }

    /**
     * get the number of minutes between the start and end time
     * @returns duration in minutes
     */
    getDurationInMinutes() {
        return (this._end.getTime() - this._start.getTime()) / 1000 / 60
    }

    /**
     * create a copy of the time range
     * @returns
     */
    copy(): TimeRange {
        return new TimeRange(new Date(this._start), new Date(this._end))
    }

    public start(): Date {
        return this._start
    }

    public setStart(start: Date) {
        this._start = start
    }

    public end(): Date {
        return this._end
    }

    public setEnd(end: Date) {
        this._end = end
    }

    /**
     * return an array of (date, hour) that  split the time range by the hour
     *
     */
    public stepsByHour(date_format: string = 'DDMMM'): Array<Array<string>> {
        const result: Array<Array<string>> = []
        const currentDate = new Date(this._start)
        let lastDate: null | Date = null

        while (currentDate <= this._end) {
            if (lastDate && lastDate.getDate() !== currentDate.getDate()) {
                result.push([DateUtil.formatDate(lastDate, date_format), lastDate.getHours().toString()])
            }
            lastDate = new Date(currentDate)
            currentDate.setHours(currentDate.getHours() + 1)
            result.push([DateUtil.formatDate(lastDate, date_format), lastDate.getHours().toString()])
        }
        return result
    }

    /**
     * each row has a hash with the date and hours key,
     * where hours is array of hour of that date
     */
    public stepsByDateAndHour(date_format: string = 'DDMMM') {
        const result: Array<AllocTimeColLabel> = []
        const currentDate = new Date(this._start)
        let lastDate: null | Date = null
        let hours: Array<string> = []
        while (currentDate <= this._end) {
            if (lastDate && lastDate.getDate() !== currentDate.getDate()) {
                result.push({ date: DateUtil.formatDate(lastDate, date_format), hours: hours })
                hours = []
            }
            lastDate = new Date(currentDate)
            const h: number = lastDate.getHours()
            const hh: string = StringUtil.padLeadingZeroForSingleDigit(h)
            hours.push(hh)
            currentDate.setHours(currentDate.getHours() + 1)
        }
        result.push({ date: DateUtil.formatDate(lastDate!, date_format), hours: hours })
        return result
    }
}
