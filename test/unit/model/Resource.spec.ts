import { describe, it, expect, beforeEach } from "vitest"
import { Resource } from '~/model/Resource'
import { Allocation } from '~/model/Allocation'
import { TimeRange } from "~/model/TimeRange"

describe('Resource', () => {

	let empty_resource : Resource
	let resource: Resource
	let allocation_a: Allocation
	let allocation_b: Allocation
	beforeEach(() => {
		const a_start = new Date('2024-03-29T08:00:00');
		const a_end = new Date('2024-03-29T22:00:00')
		const a_time_range = new TimeRange(a_start, a_end)

		allocation_a = new Allocation('id', 'name', a_time_range)

		const b_start = new Date('2024-03-29T12:00:00');
		const b_end = new Date('2024-03-29T23:00:00')
		const b_time_range = new TimeRange(b_start, b_end)

		allocation_b = new Allocation('id', 'name', b_time_range)
		empty_resource = new Resource('id1', 'name1', [])
		resource = new Resource('id2', 'name2', [allocation_a, allocation_b])
	})

	it('constructor', () => {
		expect(empty_resource instanceof Resource).toBe(true)
		expect(resource instanceof Resource).toBe(true)
	})

	it('id', () => {
		expect(empty_resource.id()).toBe('id1')
		expect(resource.id()).toBe('id2')
	})

	it('name', () => {
		expect(empty_resource.name()).toBe('name1')
		expect(resource.name()).toBe('name2')
	})

	it('removeAllocation', () => {
		expect(resource.removeAllocation(allocation_a)).toBe(true)
		expect(empty_resource.removeAllocation(allocation_a)).toBe(false)
	})

	it('addAllocation', () => {
		const c_start = new Date('2024-03-29T08:00:00');
		const c_end = new Date('2024-03-29T22:00:00')
		const c_time_range = new TimeRange(c_start, c_end)
		const allocation_c = new Allocation('A3', 'nameA3', c_time_range)
		const add_result = empty_resource.addAllocation(allocation_c)
		expect(add_result).toBe(true)
		expect(empty_resource.removeAllocation(allocation_c)).toBe(true)

	
	})

	it('addAllocation add already exists', () => {
		const add_result = resource.addAllocation(allocation_a)
		expect(add_result).toBe(false)
	})

})
