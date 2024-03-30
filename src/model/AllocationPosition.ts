import { ElementPosition } from '~/util/ElementPosition'
import { Allocation } from './Allocation'
import { TimeTableVM } from '~/view-model/TimeTableVM'

/**
 * the top-left corner of the Allocation (as html element)
 */
export class AllocationPosition {
    private _row: number
    private _position: ElementPosition = new ElementPosition()
    private _width: number = 0

    constructor(row: number) {
        this._row = row
    }

    /**
     * FIXME... change this as util or time table own this class
     * @param cellRefList 
     * @returns 
     */
    calculatePosition(alloc: Allocation, allocTimeTable: TimeTableVM) {
        this._position.setX( allocTimeTable.getCellX(alloc.timeRange().start()) )
        this._position.setY( allocTimeTable.getCellY(this._row) )
        let endX = allocTimeTable.getCellX(alloc.timeRange().end())
        this.setWidth( endX - this._position.x() )
    }

    public width(): number {
        return this._width
    }

    public setWidth(width: number) {
        if (isNaN(width) || width < 0) {
            return
        }
        this._width = width
    }

    public getActiveRow(AllocTimeTable: TimeTableVM) {
        this._row = AllocTimeTable.getActiveRow(this._position.y())
        return this._row
    }

    public relocatedToNearestGrid(alloc: Allocation, allocTimeTable: TimeTableVM) {
        // calculate the new time according to the new position
        alloc.timeRange().setStart( allocTimeTable.getTimeFromPosition(this._position.x()) )
        alloc.timeRange().setEnd( allocTimeTable.getTimeFromPosition(this._position.x() + this.width()) )
        this.calculatePosition(alloc, allocTimeTable)
        alloc.resource()?.removeAllocation(alloc)
        alloc.setResource( allocTimeTable.timeTable().getResourceByIndex(this._row) )
        alloc.resource()?.addAllocation(alloc)
    }

    public copy(): AllocationPosition {
        let copy = new AllocationPosition(this._row)
        copy._position = new ElementPosition(this._position.x(), this._position.y())
        copy.setWidth( this._width )
        return copy
    }

    public equals(other: AllocationPosition): boolean {
        return this._row === other._row && this._position.equals(other._position) && this._width === other._width
    }
    
    public position(): ElementPosition {
        return this._position
    }
}

