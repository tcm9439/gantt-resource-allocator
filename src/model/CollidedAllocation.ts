import { Allocation } from './Allocation'

/**
 * store the two allocations that collided
 */
export class CollidedAllocation {
    private _allocationA: Allocation
    private _allocationB: Allocation
    private _collision_removed: boolean = false

    constructor(allocA: Allocation, allocB: Allocation) {
        this._allocationA = allocA
        this._allocationB = allocB
        allocA.addCollision()
        allocB.addCollision()
    }

    /**
     *
     * @param alloc
     * @returns
     */
    public includes(alloc: Allocation): boolean {
        return this._allocationA === alloc || this._allocationB === alloc
    }

    /**
     * return the two allocations that collided
     * @returns
     */
    public allocations(): Allocation[] {
        return [this._allocationA, this._allocationB]
    }

    /**
     * update the collision count
     */
    public removeCollisionCount() {
        this._allocationA.removeCollision()
        this._allocationB.removeCollision()
        this._collision_removed = true
    }

    /**
     * check if the collision was removed
     * @returns
     */
    public collisionRemoved(): boolean {
        return this._collision_removed
    }
}
