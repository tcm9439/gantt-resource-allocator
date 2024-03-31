import type { Resource } from './Resource'
import { TimeRange } from './TimeRange'
import { AllocationColor } from '~/util/AllocationColor'

export class Allocation {
    private _id: string
    private _name: string
    private _time_range: TimeRange
    private _resource: Resource | undefined
    private _allowCollide: boolean = false
    private _color: AllocationColor
    public collisionCount: number = 0
    public valid: boolean = true

    constructor(id: string, name: string, time_range?: TimeRange, color?: AllocationColor) {
        this._id = id
        this._name = name
        this._time_range = time_range || new TimeRange(new Date(), new Date())
        this._color = color || AllocationColor.ORANGE
    }

    public static create(id: string, name: string, time_range: TimeRange, color: AllocationColor): Allocation {
        return new Allocation(id, name, time_range, color)
    }

    public id(): string {
        return this._id
    }

    public name(): string {
        return this._name
    }

    public setName(name: string) {
        this._name = name
    }

    public setTimeRange(time_range: TimeRange) {
        this._time_range = time_range
    }

    public timeRange(): TimeRange {
        return this._time_range
    }

    // return this for method chaining for create
    public setResource(resource: Resource) {
        this._resource = resource
        this._resource?.addAllocation(this)
        return this
    }
    public resetResource() {
        this._resource?.removeAllocation(this)
        this._resource = undefined
    }

    public resource(): Resource | undefined {
        return this._resource
    }

    public copy(): Allocation {
        const a = new Allocation(this._id, this._name, this._time_range?.copy(), this._color)
        if (this._resource) {
            a.setResource(this._resource)
        }
        return a
    }

    private static _padLeadingZero(num: number): string {
        return num.toString().padStart(2, '0')
    }

    public static toDisplayString(time: Date) {
        // return HH:mm
        return this._padLeadingZero(time.getHours()) + ':' + this._padLeadingZero(time.getMinutes())
    }

    public hasCollision(): boolean {
        return this.collisionCount > 0
    }

    public addCollision() {
        this.collisionCount++
    }

    public removeCollision() {
        this.collisionCount--
    }

    public allowCollide(): boolean {
        return this._allowCollide
    }

    public color(): AllocationColor {
        return this._color
    }
}
