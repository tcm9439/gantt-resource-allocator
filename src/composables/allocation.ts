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
    public valid: boolean = true
    
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

    private static _padLeadingZero(num: number): string {
        return num.toString().padStart(2, '0')
    }

    public static toDisplayString(time: Date){
        // return HH:mm
        return this._padLeadingZero(time.getHours()) + ":" + this._padLeadingZero(time.getMinutes())
    }

    get hasCollision(): boolean {
        return this.collisionCount > 0
    }

    setTime(time: TimeRange) {
        this.time = time
    }

    addCollision() {
        this.collisionCount++
    }

    removeCollision() {
        this.collisionCount--
    }

    resetResource() {
        this.resource?.removeAllocation(this)
        this.resource = undefined
    }
}