import { AllocationCollision } from './allocationCollision'
import { Allocation } from './allocation'

export class Resource {
    private _id: string
    private _name: string
    private _allocations: Allocation[] = []
    private _collisions: AllocationCollision[] = []
    private _bufferMinutes: number = 0
    private _allowCollision: boolean = false

    constructor(id: string, name: string, bufferMinutes: number = 0, allowCollision: boolean = false, allocations: Allocation[] = []) {
        this._id = id
        this._name = name
        this._bufferMinutes = bufferMinutes
        this._allowCollision = allowCollision
        this._allocations = allocations
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get bufferMinutes(): number {
        return this._bufferMinutes
    }

    get allowCollision(): boolean {
        return this._allowCollision
    }

    get allocations(): Allocation[] {
        return this._allocations
    }

    get collisions(): AllocationCollision[] {
        return this._collisions
    }

    removeAllocation(alloc: Allocation) {
        let index = this.allocations.indexOf(alloc)
        if (index !== -1) {
            this.allocations.splice(index, 1)
        }

        // remove from collisions
        let newCollisions: AllocationCollision[] = []
        for (let i = 0; i < this.collisions.length; i++) {
            if (this.collisions[i].includes(alloc)) {
                this.collisions[i].remove()
            } else {
                newCollisions.push(this.collisions[i])
            }
        }
        this._collisions = newCollisions
    }

    addAllocation(alloc: Allocation) {
        // if alloc is already in the list, then we can skip the collision check
        if (this.allocations.indexOf(alloc) !== -1) {
            return
        }
        
        // compute all collisions
        for (let i = 0; i < this.allocations.length; i++) {
            if (this.allocations && alloc.allowCollide && this.allocations[i].allowCollide) {
                // if both allocations allow collision, then we can skip the collision check
                continue
            }

            if (this.allocations[i].time.isTimeRangeOverlap(alloc.time)) {
                console.trace('addAllocation - collision detected')
                this.collisions.push(new AllocationCollision(this.allocations[i], alloc))
            }
        }
        
        this.allocations.push(alloc)
    }
}