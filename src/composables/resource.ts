import { AllocationCollision } from './allocationCollision'
import { Allocation } from './allocation'

export class Resource {
    public id: string
    public name: string
    public allocations: Allocation[] = []
    public collisions: AllocationCollision[] = []
    public bufferMinutes: number = 0
    public allowCollision: boolean = false

    constructor(id: string, name: string, bufferMinutes: number = 0, allowCollision: boolean = false, allocations: Allocation[] = []) {
        this.id = id
        this.name = name
        this.bufferMinutes = bufferMinutes
        this.allowCollision = allowCollision
        this.allocations = allocations
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
        this.collisions = newCollisions
    }

    addAllocation(alloc: Allocation) {
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