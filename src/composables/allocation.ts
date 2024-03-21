import type { Resource } from './resource'
import { TimeRange } from './util/timeRange'
import { AllocationElementColor } from './allocationElementColor'

export class Allocation {
    public name: string
    public id: string
    public time: TimeRange
    public resource: Resource | undefined
    public allowCollide: boolean = false
    public color: AllocationElementColor
    public collisionCount: number = 0
    
    constructor(id: string, name: string, time?: TimeRange, resource?: Resource, color?: AllocationElementColor) {
        this.id = id
        this.name = name
        this.time = time || new TimeRange(new Date(), new Date())
        this.resource = resource
        this.color = color || AllocationElementColor.ORANGE

        this.resource?.addAllocation(this)
    }

    copy(): Allocation {
        return new Allocation(this.id, this.name, this.time?.copy(), this.resource, this.color)
    }

    _padLeadingZero(num: number): string {
        let s = "0" + num;
        return s.substring(s.length - 2);
    }

    _toDisplayString(time: Date){
        // return HH:mm
        return this._padLeadingZero(time.getHours()) + ":" + this._padLeadingZero(time.getMinutes())
    }

    getStartTimeDisplayString(): string {
        if (this.time === undefined) {
            return ''
        }
        return this._toDisplayString(this.time.start)
    }

    getEndTimeDisplayString(): string {
        if (this.time === undefined) {
            return ''
        }
        return this._toDisplayString(this.time.end)
    }

    get hasCollision(): boolean {
        return this.collisionCount > 0
    }

    addCollision() {
        this.collisionCount++
    }

    removeCollision() {
        this.collisionCount--
    }
}