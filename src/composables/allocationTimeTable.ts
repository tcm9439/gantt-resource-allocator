import { TimeRange } from "./util/timeRange"
import type { Resource } from "./resource"

export type AllocTimeColLabel = {
    date: string,
    hours: Array<string>
}

export class AllocTimeColLabelList {
    static readonly MINUTE_HEADER = ["00", "15", "30", "45"]
    public colLabels: Array<AllocTimeColLabel> = []

    constructor(colLabels: Array<AllocTimeColLabel>){
        this.colLabels = colLabels
    }

    getTotalNumberOfTimeColumns(): number {
        return this.colLabels.reduce((acc, cur) => acc + cur.hours.length, 0) * 4
    }

    // Array<[ key, label, colSpan]>
    // key = date-header+date+label
    getAllDates(): Array<{vKey: string, label: string, colSpan: number}> {
        let result: Array<{vKey: string, label: string, colSpan: number}> = []
        for (let i = 0; i < this.colLabels.length; i++) {
            result.push({
                vKey: `date-header-${this.colLabels[i].date}`,
                label: this.colLabels[i].date,
                colSpan: this.colLabels[i].hours.length * 4
            })
        }
        return result
    }
    
    // Array<[ key, label ]>
    // key = hour-header+date+label
    getAllHours(): Array<{vKey: string, label: string}> {
        let result: Array<{vKey: string, label: string}> = []
        for (let i = 0; i < this.colLabels.length; i++) {
            for (let j = 0; j < this.colLabels[i].hours.length; j++) {
                result.push({
                    vKey: `hour-header-${this.colLabels[i].date}-${this.colLabels[i].hours[j]}`,
                    label: this.colLabels[i].hours[j]
                })
            }
        }
        return result
    }

    getAllMinutes(): Array<{vKey: string, label: string}> {
        let result: Array<{vKey: string, label: string}> = []
        for (let i = 0; i < this.colLabels.length; i++) {
            for (let j = 0; j < this.colLabels[i].hours.length; j++) {
                for (let k of AllocTimeColLabelList.MINUTE_HEADER) {
                    result.push({
                        vKey: `min-header-${this.colLabels[i].date}-${this.colLabels[i].hours[j]}-${k}`,
                        label: k
                    })
                }
            }
        }
        return result
    }
}

export class AllocTimeTable {
    public resources: Array<Resource> = []
    public timeRange: TimeRange

    public columnsY: Array<number> = []
    public rowsX: Array<number> = []

    public minX: number = 0
    public minY: number = 0
    public maxX: number = 0
    public maxY: number = 0

    public colOffset: number = 0    // x offset due to header
    public rowOffset: number = 0    // y offset due to header
    public rowPaddingOffset: number = 0
    
    public colWidth: number = 0
    // number of px per minute
    public minuteWidth: number = 0
    public rowHeight: number = 0
    
    public minutePrecision: number = 5

    constructor(startTime: Date, endTime: Date, resources: Array<Resource>, minutePrecision?: number) {
        this.timeRange = new TimeRange(startTime, endTime)
        this.resources = resources
        this.minutePrecision = minutePrecision || 5
    }

    _padLeadingZero(num: number): string {
        let s = "0" + num;
        return s.substring(s.length - 2);
    }

    _toDateOnlyString(date: Date): string {
        // DDMMM
        return date.getDate() + date.toDateString().substring(3, 7)
    }

    initCellRefList(cellRefList: Array<Array<HTMLElement>>, timeColCount: number) {
        for (let i = 0; i < this.resources.length; i++) {
            cellRefList.push([])
            cellRefList[i].length = timeColCount
        }
    }

    getResourceRowLabel(): Array<{vKey: string, label: string, index: number}> {
        let result: Array<{vKey: string, label: string, index: number}> = []
        for (let i = 0; i < this.resources.length; i++) {
            result.push({ vKey: this.resources[i].id, label: this.resources[i].name, index: i })
        }
        return result
    }

    getTableHourLabel(): AllocTimeColLabelList {
        let result: Array<AllocTimeColLabel> = []
        // for each hour within time range
        let dayIndex = -1
        let currentDate = new Date(this.timeRange.start)
        let lastDate: null | Date = null
        while (currentDate <= this.timeRange.end) {
            if (!lastDate || lastDate.getDate() != currentDate.getDate()){
                currentDate.setDate(currentDate.getDate() + dayIndex)
                result.push({ date: this._toDateOnlyString(currentDate), hours: [] })
                dayIndex++
            }
            result[dayIndex].hours.push(this._padLeadingZero(currentDate.getHours()))
            lastDate = new Date(currentDate)
            currentDate.setHours(currentDate.getHours() + 1)
        }
        return new AllocTimeColLabelList(result)
    }

    /**
     * 
     * @param rowNonOffsetPx 
     * @param cellRefList element ref to each time cell => cellRefList[resource row][timeIndex]
     */
    initValues(rowOffsetPercentage: number, tableRef: HTMLElement, cellRefList: Array<Array<HTMLElement>>) {
        let firstCellBox = cellRefList[0][0].getBoundingClientRect()
        let tableBox = tableRef.getBoundingClientRect()

        // load row and column positions
        this.columnsY = []
        for (let i = 0; i < cellRefList.length; i++) {
            this.columnsY.push(cellRefList[i][0].getBoundingClientRect().y - tableBox.y)
        }

        this.rowsX = []
        for (let i = 0; i < cellRefList[0].length; i++) {
            this.rowsX.push(cellRefList[0][i].getBoundingClientRect().x - tableBox.x)
        }

        this.colWidth = firstCellBox.width
        this.rowHeight = firstCellBox.height
        this.minuteWidth = this.colWidth / 15
        this.colOffset = firstCellBox.x - tableBox.x
        this.rowOffset = firstCellBox.y - tableBox.y
        this.rowPaddingOffset = this.rowHeight * rowOffsetPercentage / 100 + 1 // for the 1px border

        this.minX = this.rowsX[0]
        this.minY = this.columnsY[0]
        this.maxX = this.rowsX[this.rowsX.length - 1] + this.colWidth
        this.maxY = this.columnsY[this.columnsY.length - 1] + this.rowHeight
    }

    _getMinutesDiff(time1: Date, time2: Date): number {
        return Math.floor((time2.getTime() - time1.getTime()) / 1000 / 60)
    }

    getCellX(time: Date) {
        let minuteDiff = this._getMinutesDiff(this.timeRange.start, time)
        let hourDiff = Math.floor(minuteDiff / 60)
        minuteDiff = minuteDiff % 60
        let timeIndex = hourDiff * 4 + Math.floor(minuteDiff / 15)
        return this.rowsX[timeIndex] + minuteDiff % 15 * this.minuteWidth + 0.5
    }

    getCellY(row: number) {
        return this.columnsY[row] + this.rowPaddingOffset
    }

    getActiveRow(y: number) {
        let midY = y + this.rowHeight / 2
        return Math.floor((midY - this.rowOffset) / this.rowHeight)
    }

    getTimeFromPosition(x: number) {
        let midX = x - this.colOffset + this.colWidth / 2
        for (let i = 0; i < this.rowsX.length; i++) {
            if (midX < this.rowsX[i] + this.colWidth) {
                let time = new Date(this.timeRange.start)
                time.setHours(time.getHours() + Math.floor(i / 4))
                let minutes = i % 4 * 15 + (x - this.rowsX[i]) / this.minuteWidth
                // round to the nearest <precision> minutes
                time.setMinutes(Math.round(minutes / this.minutePrecision) * this.minutePrecision)
                return time
            }
        }
        throw new Error("Time not found")
    }

    getCellWidth(minutes: number) {
        // minus the 0.5px border
        return minutes * this.minuteWidth - 0.5 * Math.floor(minutes / 15)
    }

    getResourceByIndex(index: number): Resource {
        return this.resources[index]
    }

    getResourceIndex(resource: Resource | undefined): number {
        if (!resource) {
            return 0
        }
        return this.resources.indexOf(resource) 
    }
}
