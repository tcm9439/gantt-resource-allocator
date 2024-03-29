import { AllocTimeTable } from './allocationTimeTable'
import { ElementPosition } from './util/elementPosition'
import { Allocation } from './allocation'

export class AllocationPosition {
    public row: number
    public position: ElementPosition = new ElementPosition()
    private _width: number = 0

    constructor(row: number) {
        this.row = row
    }

    /**
     * 
     * @param cellRefList 
     * @returns 
     */
    calculatePosition(alloc: Allocation, allocTimeTable: AllocTimeTable) {
        this.position.x = allocTimeTable.getCellX(alloc.time.start)
        this.position.y = allocTimeTable.getCellY(this.row)
        let endX = allocTimeTable.getCellX(alloc.time.end)
        this.width = endX - this.position.x
    }

    get width(): number {
        return this._width
    }

    set width(width: number) {
        if (isNaN(width) || width < 0) {
            return
        }
        this._width = width
    }

    getActiveRow(AllocTimeTable: AllocTimeTable) {
        this.row = AllocTimeTable.getActiveRow(this.position.y)
        return this.row
    }

    relocatedToNearestGrid(alloc: Allocation, allocTimeTable: AllocTimeTable) {
        // calculate the new time according to the new position
        alloc.time.start = allocTimeTable.getTimeFromPosition(this.position.x)
        alloc.time.end = allocTimeTable.getTimeFromPosition(this.position.x + this.width)
        this.calculatePosition(alloc, allocTimeTable)
        alloc.resource?.removeAllocation(alloc)
        alloc.resource = allocTimeTable.getResourceByIndex(this.row)
        alloc.resource?.addAllocation(alloc)
    }

    copy(): AllocationPosition {
        let copy = new AllocationPosition(this.row)
        copy.position = new ElementPosition(this.position.x, this.position.y)
        copy.width = this.width
        return copy
    }

    equals(other: AllocationPosition): boolean {
        return this.row === other.row && this.position.equals(other.position) && this.width === other.width
    }
}

