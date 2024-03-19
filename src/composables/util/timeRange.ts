export class TimeRange {
    public start: Date
    public end: Date

    constructor(start: Date, end: Date) {
        this.start = start
        this.end = end
    }

    isTimeWithinThis(date: Date): boolean {
        return date >= this.start && date <= this.end
    }

    isTimeRangeOverlap(timeRange: TimeRange): boolean {
        return this.isTimeWithinThis(timeRange.start) || this.isTimeWithinThis(timeRange.end) || timeRange.isTimeWithinThis(this.start) || timeRange.isTimeWithinThis(this.end)
    }

    isTimeRangeWithinThis(timeRange: TimeRange): boolean {
        return this.isTimeWithinThis(timeRange.start) && this.isTimeWithinThis(timeRange.end)
    }

    getDurationInMinutes() {
        return (this.end.getTime() - this.start.getTime()) / 1000 / 60
    }

    copy(): TimeRange {
        return new TimeRange(new Date(this.start), new Date(this.end))
    }
}