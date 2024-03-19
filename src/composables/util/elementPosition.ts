export class ElementPosition {
    public x: number
    public y: number

    constructor(x?: number, y?: number) {
        this.x = x || 0
        this.y = y || 0
    }

    toString() {
        return `[x: ${Math.floor(this.x)}, y: ${Math.floor(this.y)}]`
    }
}
