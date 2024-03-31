import { Resource } from '~/model/Resource'
import { TimeRange } from '~/model/TimeRange'
import { TimeTable } from '~/model/TimeTable'
import { DateUtil } from '~/util/DateUtil'
import { HtmlElementBoundingRect } from '~/types/common-type'

export class TimeTableVM {
    private _time_table: TimeTable
    private _timeRange: TimeRange
    private _minutePrecision: number = 5
    private _resources: Array<Resource> = []

    // -- end duplicate variable ---

    // width of a minute in the time table
    private _minuteWidth: number = 0
    private _itemTopPadding = 0
    private _rowHeight: number = 0
    private _rowOffset: number = 0 // y offset due to header
    private _colWidth: number = 0
    private _colOffset: number = 0 // x offset due to header

    private _minX: number = 0
    private _minY: number = 0
    private _maxX: number = 0
    private _maxY: number = 0

    // y position of each row, exclude the header
    private _columnsY: Array<number> = []
    // x position of each column, exclude the header
    private _rowsX: Array<number> = []

    private _cells: Array<Array<HtmlElementBoundingRect>> = []

    private _cell_top_padding_percentage = 0.1

    /**
     * give the time table, generate the view model for the time table
     *
     * @param time_table
     * @param timeColCount
     */
    public constructor(time_table: TimeTable) {
        const timeColCount: number = time_table.timeColumnCount()

        this._time_table = time_table
        // variable from TimeTable, temp variable, fix later
        this._timeRange = time_table.timeRange()
        this._minutePrecision = time_table.minutePrecision()
        this._resources = time_table.resources()

        // to initialize all cells of the time table
        // each row (resource) has a list of cells (time column)
        const resource_count = this._resources.length
        for (let i = 0; i < resource_count; i++) {
            // this._resources.length
            this._cells.push([])
            this._cells[i].length = timeColCount
        }
    }

    // /**
    //  * to initialize all cells of the time table
    //  * each row (resource) has a list of cells (time column)
    //  *
    //  * @param cellRefList element ref to each time cell => cellRefList[resource row][timeIndex]
    //  * @param timeColCount
    //  */
    // public initCellRefList(cellRefList: Array<Array<HTMLElement>>, resource_count: number, timeColCount: number) {
    //     for (let i = 0; i < resource_count; i++) { // this._resources.length
    //         this._cells.push([])
    //         this._cells[i].length = timeColCount
    //     }
    // }

    // /**
    //  * bind the timetable td to the cell of TimeTableVM cell
    //  * see setCellRef of timetable.vue
    //  * @param row  resource row index
    //  * @param column
    //  * @param el
    //  */
    // public setCellRef(row: number, column: number, el: Element) {
    //     // console.log("setCellRef", row, column, el)
    //     this._cells[row][column] = el as HTMLElement
    // }

    // public cellRef(row: number, column: number): HTMLElement {
    //     return this._cells[row][column]
    // }

    private _tableBoundRect: HtmlElementBoundingRect = { x: 0, y: 0, width: 0, height: 0 }

    /**
     *  tableRef.getBoundingClientRect()
     * @param rect
     */
    public setTableBoundRect(rect: HtmlElementBoundingRect) {
        this._tableBoundRect = rect
    }
    public getTableBoundRect(): HtmlElementBoundingRect {
        return this._tableBoundRect
    }

    // this._cells[0][0].getBoundingClientRect()
    public setCellBoundRect(row: number, column: number, rect: HtmlElementBoundingRect) {
        //console.log("setCellBoundRect", row, column, rect)
        this._cells[row][column] = rect
    }
    public getCellBoundRect(row: number, column: number): HtmlElementBoundingRect {
        return this._cells[row][column]
    }

    /**
     *
     * NOTE: initValues MUST be called after all cells are binded  with TimeTableVM.setCellRef
     *
     * @param rowNonOffsetPx
     * @param cellRefList element ref to each time cell => cellRefList[resource row][timeIndex]
     */
    public initValues() {
        // console.log("initValues", this._cells, tableRef)
        let firstCellBox = this._cells[0][0]
        console.log('firstCellBox', firstCellBox)
        let tableBox = this._tableBoundRect

        // load row and column positions
        this._columnsY = []
        for (let i = 0; i < this._cells.length; i++) {
            console.log('Column Y ', i, this._cells[i][0].y, tableBox.y)
            this._columnsY.push(this._cells[i][0].y - tableBox.y)
        }

        this._rowsX = []
        for (let i = 0; i < this._cells[0].length; i++) {
            this._rowsX.push(this._cells[0][i].x - tableBox.x)
        }

        this._colWidth = firstCellBox.width
        this._rowHeight = firstCellBox.height

        this._minuteWidth = this._colWidth / 15

        // first cell offset to the table header
        this._colOffset = firstCellBox.x - tableBox.x
        this._rowOffset = firstCellBox.y - tableBox.y

        // the padding offset (of the item within the row/cell) of the cell
        //  FIXME itemTopPadding should be a better name
        this._itemTopPadding = this._rowHeight * this._cell_top_padding_percentage + 1 // for the 1px border

        this._minX = this._rowsX[0]
        this._minY = this._columnsY[0]
        this._maxX = this._rowsX[this._rowsX.length - 1] + this._colWidth
        this._maxY = this._columnsY[this._columnsY.length - 1] + this._rowHeight
    }

    /**
     * Column width of a cell, represent 15 minutes slot in the time table
     */
    public columnWidth(): number {
        return this._colWidth
    }

    public rowHeight(): number {
        return this._rowHeight
    }

    /**
     * width of a minute in the time table
     * @returns
     */
    public minuteWidth(): number {
        return this._minuteWidth
    }

    public columnsY(): Array<number> {
        return this._columnsY
    }

    public rowsX(): Array<number> {
        return this._rowsX
    }

    /**
     * the x offset of the first cell to the table header
     * @returns
     */
    public colOffset(): number {
        return this._colOffset
    }

    /**
     * the y offset of the first cell to the table header
     * @returns
     */
    public rowOffset(): number {
        return this._rowOffset
    }

    public timeRange(): TimeRange {
        return this._timeRange
    }

    /**
     * use the time to get the cel x position (pixel)
     * @param time
     * @returns
     */
    public getCellX(time: Date): number {
        let minuteDiff = DateUtil.getMinutesDiff(this._timeRange.start(), time)
        let hourDiff = Math.floor(minuteDiff / 60)
        minuteDiff = minuteDiff % 60
        let timeIndex = hourDiff * 4 + Math.floor(minuteDiff / 15)
        return this._rowsX[timeIndex] + (minuteDiff % 15) * this._minuteWidth + 0.5
    }

    public setItemTopPadding(value: number) {
        this._itemTopPadding = value
    }

    public getItemTopPadding(): number {
        return this._itemTopPadding
    }

    public getCellY(row: number) {
        return this._columnsY[row] + this._itemTopPadding
    }

    /**
     * get the active row based on the y position
     * @param y
     * @returns
     */
    public getActiveRow(y: number) {
        let midY = y + this._rowHeight / 2
        return Math.floor((midY - this._rowOffset) / this._rowHeight)
    }

    public getTimeFromPosition(x: number): Date {
        let midX = x - this._colOffset + this._colWidth / 2
        for (let i = 0; i < this._rowsX.length; i++) {
            if (midX < this._rowsX[i] + this._colWidth) {
                let time = new Date(this._timeRange.start())
                time.setHours(time.getHours() + Math.floor(i / 4))
                let minutes = (i % 4) * 15 + (x - this._rowsX[i]) / this._minuteWidth
                // round to the nearest <precision> minutes
                time.setMinutes(Math.round(minutes / this._minutePrecision) * this._minutePrecision)
                return time
            }
        }
        throw new Error('Time not found')
    }

    /**
     * get cell width based on the minutes represented by the cell
     * e.g. task task 60 minutes
     * @param minutes
     * @returns
     */
    public getCellWidth(minutes: number): number {
        // minus the 0.5px border
        return minutes * this._minuteWidth - 0.5 * Math.floor(minutes / 15)
    }

    public getTopLeftCorner(): [number, number] {
        return [this._minX, this._minY]
    }

    public getBottomRightCorner(): [number, number] {
        return [this._maxX, this._maxY]
    }

    public minX(): number {
        return this._minX
    }

    public minY(): number {
        return this._minY
    }

    public maxX(): number {
        return this._maxX
    }

    public maxY(): number {
        return this._maxY
    }

    public getResourceIndex(resource: Resource | undefined): number {
        return this._time_table.getResourceIndex(resource)
    }

    public timeTable(): TimeTable {
        return this._time_table
    }

    /**
     * when the time table is ready (the OnReady() is called),
     * call the registered listener
     */
    private _on_ready_listener: any[] = []
    registerOnReadyListener(listener: any) {
        this._on_ready_listener.push(listener)
    }

    public onReady() {
        this.initValues()
        for (let i = 0; i < this._on_ready_listener.length; i++) {
            this._on_ready_listener[i]()
        }
    }
}
