/**
 * Represents a position of an element in the DOM.
 * (x, y) is the coordinate of the top-left corner of the element.
 */
export class ElementPosition {
    private _x: number
    private _y: number

    constructor(x?: number, y?: number) {
        this._x = x || 0
        this._y = y || 0
    }

    public x(): number {
        return this._x
    }

    public setX(x: number) {
        this._x = x
    }

    public y(): number {
        return this._y
    }
    
    public setY(y: number) {
        this._y = y
    }

    toString() {
        return `[x: ${Math.floor(this._x)}, y: ${Math.floor(this._y)}]`
    }

    equals(other: ElementPosition): boolean {
        // return this._x === other._x && this._y === other._y

        // compare the coordinates with a tolerance of 1 pixel
        return Math.abs(this._x - other._x) <= 1 && Math.abs(this._y - other._y) <= 1
    }
}
