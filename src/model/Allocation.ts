import type { Resource } from './Resource'
import { TimeRange } from './TimeRange'
import { AllocationColor } from '~/util/AllocationColor'
import { StringUtil } from '~/util/StringUtil'

/**
 * An allocation represent a time range that a resource is allocated to some task.
 */
export class Allocation {
    private _id: string
    private _name: string
    private _time_range: TimeRange
    // the resource that hold this allocation
    private _resource: Resource | undefined
    // if this allocation can collide with other allocations
    private _allowCollide: boolean = false
    // color for display
    private _color: AllocationColor
    // number of collision with other allocations
    public collisionCount: number = 0
    // if this allocation is valid
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
        if (this._resource === resource) {
            return this
        } else if (this._resource) {
            this.resetResource()
        }

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

    /**
     * Format time to HH:mm
     * @param time
     * @returns HH:mm
     */
    public static toDisplayString(time: Date) {
        return (
            StringUtil.padLeadingZeroForSingleDigit(time.getHours()) +
            ':' +
            StringUtil.padLeadingZeroForSingleDigit(time.getMinutes())
        )
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
