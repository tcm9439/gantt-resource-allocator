import { CollidedAllocation } from './CollidedAllocation'
import { Allocation } from './Allocation'

/**
 * Resource could have multiple allocations
 */
export class Resource {
    private _id: string
    private _name: string
    private _allocations: Allocation[] = []
    private _collisions: CollidedAllocation[] = []
    // private _bufferMinutes: number = 0
    // private _allowCollision: boolean = false

    constructor(id: string, name: string, allocations: Allocation[] = []) {
        this._id = id
        this._name = name
        this._allocations = allocations
        // remove _bufferMinutes, _allowCollision from constructor
        // bufferMinutes: number = 0, allowCollision: boolean = false,
        // this._bufferMinutes = bufferMinutes
        // this._allowCollision = allowCollision
    }

    public id(): string {
        return this._id
    }

    public name(): string {
        return this._name
    }

    // public bufferMinutes(): number {
    //     return this._bufferMinutes
    // }

    // public setBufferMinutes(minutes: number) {
    //     this._bufferMinutes = minutes
    // }

    // public allowCollision(): boolean {
    //     return this._allowCollision
    // }

    // public setAllowCollision(allow: boolean) {
    //     this._allowCollision = allow
    // }

    /**
     * remove allocation from the resource
     * @param alloc
     */
    public removeAllocation(alloc: Allocation): boolean {
        const index = this._allocations.indexOf(alloc)
        let removed = false
        if (index !== -1) {
            this._allocations.splice(index, 1)
            removed = true
        }

        // remove from allocation from _collisions
        const newCollisions: CollidedAllocation[] = []
        for (let i = 0; i < this._collisions.length; i++) {
            if (this._collisions[i].includes(alloc)) {
                this._collisions[i].removeCollisionCount()
            } else {
                newCollisions.push(this._collisions[i])
            }
        }
        this._collisions = newCollisions

        return removed
    }

    /**
     * add allocation to the resource, also check for collision
     * @param alloc
     * @returns
     */
    public addAllocation(alloc: Allocation): boolean {
        // if alloc is already in the list, then we can skip the collision check
        if (this._allocations.indexOf(alloc) !== -1) {
            return false
        }

        // compute all collisions
        for (let i = 0; i < this._allocations.length; i++) {
            if (this._allocations && alloc.allowCollide() && this._allocations[i].allowCollide()) {
                // if both allocations allow collision, then we can skip the collision check
                continue
            }

            if (this._allocations[i].timeRange().overlapTimeRange(alloc.timeRange())) {
                console.trace('addAllocation - collision detected')
                this._collisions.push(new CollidedAllocation(this._allocations[i], alloc))
            }
        }

        this._allocations.push(alloc)
        return true
    }
}
