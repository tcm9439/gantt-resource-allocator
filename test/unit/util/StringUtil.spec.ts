import { describe, it, expect, beforeEach } from "vitest"
import { StringUtil } from '~/util/StringUtil'

describe('StringUtil', () => {
	it('padLeadingZeroForSingleDigit', () => {

		expect(StringUtil.padLeadingZeroForSingleDigit(1)).toBe('01')
		expect(StringUtil.padLeadingZeroForSingleDigit(10)).toBe('10')
	})
})
