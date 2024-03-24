import { Allocation } from './allocation'

export class AllocationCollision {
    public allocationA: Allocation
    public allocationB: Allocation

    constructor(allocA: Allocation, allocB: Allocation) {
        this.allocationA = allocA
        this.allocationB = allocB
        allocA.addCollision()
        allocB.addCollision()
    }

    includes(alloc: Allocation) {
        return this.allocationA === alloc || this.allocationB === alloc
    }

    get allocations(): Allocation[] {
        return [this.allocationA, this.allocationB]
    }

    remove() {
        this.allocationA.removeCollision()
        this.allocationB.removeCollision()
    }
}
