import { describe, it, expect, beforeEach } from "vitest"
import { Allocation } from "~/model/Allocation";
import { Resource } from "~/model/Resource";
import { TimeRange } from "~/model/TimeRange";
import { TimeTable } from '~/model/TimeTable'
import { TimeColumnLabel } from "~/view-model/TimeColumnLabel";

describe('TimeTable', () => {

	// time table 06:00 - 14:00
	const start = new Date('2024-03-29T06:00:00.000Z');
	const end = new Date('2024-03-29T14:00:00.000Z')
	
	let resources:Resource[] = []
	let timeTable: TimeTable

	beforeEach(() => {
		const a_start = new Date('2024-03-29T08:00:00.000Z');
		const a_end = new Date('2024-03-29T09:00:00.000Z')
		const a_time_range = new TimeRange(a_start, a_end)

		const allocation_a = new Allocation('A1', 'name_a1', a_time_range)

		const b_start = new Date('2024-03-29T10:00:00.000Z');
		const b_end = new Date('2024-03-29T11:00:00.000Z')
		const b_time_range = new TimeRange(b_start, b_end)

		const allocation_b = new Allocation('A2', 'name_a2', b_time_range)

		const resource = new Resource('R1', 'name_r1', [allocation_a, allocation_b])
		resources= [resource]

		timeTable = new TimeTable(start, end, resources)
	})
	

	it('constructor', () => {
		
		expect(timeTable instanceof TimeTable).toBe(true)
	})

	it('timeRange', () => {
		expect(timeTable.timeRange().start()).toStrictEqual(start)
		expect(timeTable.timeRange().end()).toStrictEqual(end)
	})

	it('minutePrecision', () => {
		expect(timeTable.minutePrecision()).toBe(5)
	})

	it('resources', () => {
		expect(timeTable.resources()).toStrictEqual(resources)
	})

	it('getResourceRowLabel', () => {
		const resourceRowLabel = timeTable.getResourceRowLabel()
		expect(resourceRowLabel[0].vKey).toBe('R1')
		expect(resourceRowLabel[0].label).toBe('name_r1')

		// length of resourceRowLabel
		expect(resourceRowLabel.length).toBe(1)
		//expect(resourceRowLabel[0].index).toBe(0)
	})

	it('getResourceByIndex', () => {
		const resource = timeTable.getResourceByIndex(0)
		expect(resource.id()).toBe('R1')
		expect(resource.name()).toBe('name_r1')
	})

	it('getResourceIndex', () => {
		const resource = timeTable.getResourceByIndex(0)
		const index = timeTable.getResourceIndex(resource)
		expect(index).toBe(0)
	})

	it('getTableColumnLabel', () => {
		const tableColumnLabel = timeTable.getTableColumnLabel()
		expect(tableColumnLabel instanceof TimeColumnLabel).toBe(true)

		// tableColumnLabel 
		// getTotalNumberOfTimeColumns
		// 06:00 - 14:00: 9 hours * 4 (4 slot per hour)
		expect(tableColumnLabel.getTotalNumberOfTimeColumns()).toBe(36)

		// getAllDates
		const allDates = tableColumnLabel.getAllDates()
		expect(allDates.length).toBe(1)
		expect(allDates[0].vKey).toBe('date-header-29 Mar')

		// getAllHours
		const allHours = tableColumnLabel.getAllHours()
		expect(allHours.length).toBe(9)
		expect(allHours[0].vKey).toBe('hour-header-29 Mar-14') // convert to HKT? 
		expect(allHours[8].vKey).toBe('hour-header-29 Mar-22')

	})
})
