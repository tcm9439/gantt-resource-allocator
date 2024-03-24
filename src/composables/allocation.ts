import type { Resource } from './resource'
import { TimeRange } from './util/timeRange'
import { AllocationElementColor } from './allocationElementColor'

export class Allocation {
    private _name: string
    private _id: string
    private _time: TimeRange
    private _resource: Resource | undefined
    private _allowCollide: boolean = false
    private _color: AllocationElementColor
    private _collisionCount: number = 0
    private _valid: boolean = true
    
    constructor(id: string, name: string, time?: TimeRange, resource?: Resource, color?: AllocationElementColor) {
        this._id = id
        this._name = name
        this._time = time || new TimeRange(new Date(), new Date())
        this._resource = resource
        this._color = color || AllocationElementColor.ORANGE

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

    public get hasCollision(): boolean {
        return this._collisionCount > 0
    }

    public get allowCollide(): boolean {
        return this._allowCollide
    }

    public addCollision() {
        this._collisionCount++
    }

    public removeCollision() {
        this._collisionCount--
    }

    public get resource(): Resource | undefined {
        return this._resource
    }

    public set resource(value: Resource | null) {
        if (this._resource) {
            this._resource.removeAllocation(this)
        }
        if (value) {
            value.addAllocation(this)
            this._resource = value
        }
    }
    
    public get time(): TimeRange {
        return this._time
    }

    public set time(value: TimeRange) {
        this._time = value
    }

    public get id(): string {
        return this._id
    }

    public get name(): string {
        return this._name
    }

    public set name(value: string) {
        this._name = value
    }

    public get color(): AllocationElementColor {
        return this._color
    }

    public get valid(): boolean {
        return this._valid
    }

    public set valid(value: boolean) {
        this._valid = value
    }
}