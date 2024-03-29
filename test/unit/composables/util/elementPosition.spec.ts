import { describe, it, expect } from "vitest"
import { ElementPosition } from "~/composables/util/elementPosition"

describe("elementPosition", () => {
	it("constructor", () => {
        const ep = new ElementPosition()
        expect(ep.x).toBe(0)
        expect(ep.y).toBe(0)
	})
})
