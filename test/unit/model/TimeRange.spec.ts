import { describe, it, expect, beforeEach } from "vitest"
import { TimeRange } from '~/model/TimeRange'

describe('TimeRange', () => {

	let timeRange: TimeRange
	const start = new Date('29 MarT08:00:00');
	const end = new Date('29 MarT22:00:00')
	beforeEach(() => {
		
		timeRange = new TimeRange(start, end)
	})
	it('constructor', () => {
	
		expect(timeRange instanceof TimeRange).toBe(true)
	})

	it('contains', () => {
		const date = new Date('29 MarT21:00:00')
		expect(timeRange.contains(date)).toBe(true)
	})

	it('overlapTimeRange', () => {

		const start2 = new Date('29 MarT12:00:00');
		const end2 = new Date('29 MarT23:00:00')
		const timeRange2 = new TimeRange(start2, end2)
		expect(timeRange.overlapTimeRange(timeRange2)).toBe(true)
	})

	it('containsTimeRange', () => {
		const start2 = new Date('29 MarT09:00:00');
		const end2 = new Date('29 MarT22:00:00')
		const timeRange2 = new TimeRange(start2, end2)
		expect(timeRange.containsTimeRange(timeRange2)).toBe(true)
	})

	it('getDurationInMinutes', () => {
		
		// (end.getTime() - start.getTime()) / 1000 / 60
		expect(timeRange.getDurationInMinutes()).toBe(840)
	})

	it('copy', () => {
		const start = new Date()
		const end = new Date()
		const timeRange = new TimeRange(start, end)
		const copy = timeRange.copy()
		expect(copy instanceof TimeRange).toBe(true)
		expect(copy.start()).toStrictEqual(start)
		expect(copy.end()).toStrictEqual(end)
	})

	it('start', () => {
		const timeRange = new TimeRange(start, end)
		expect(timeRange.start()).toStrictEqual(start)
	})

	it('setStart', () => {
		const timeRange = new TimeRange(start, end)
		const newStart = new Date('29 MarT09:00:00');
		timeRange.setStart(newStart)
		expect(timeRange.start()).toStrictEqual(newStart)
	})


	it('end', () => {
		const timeRange = new TimeRange(start, end)
		expect(timeRange.end()).toStrictEqual(end)
	})

	it('setEnd', () => {
		const timeRange = new TimeRange(start, end)
		const newEnd = new Date('29 MarT09:00:00');
		timeRange.setEnd(newEnd)
		expect(timeRange.end()).toStrictEqual(newEnd)
	})

	it('stepsByHour', () => {
		const timeRange = new TimeRange(start, end)
		const steps = timeRange.stepsByHour()
		expect(steps).toStrictEqual([
			["29 Mar","8"],
			["29 Mar","9"],
			["29 Mar","10"],
			["29 Mar","11"],
			["29 Mar","12"],
			["29 Mar","13"],
			["29 Mar","14"],
			["29 Mar","15"],
			["29 Mar","16"],
			["29 Mar","17"],
			["29 Mar","18"],
			["29 Mar","19"],
			["29 Mar","20"],
			["29 Mar","21"],
			["29 Mar","22"]
		
		])
		
	})

	it('stepsByDateAndHour', () => {
		const timeRange = new TimeRange(start, end)
		const steps = timeRange.stepsByDateAndHour()
		expect(steps).toStrictEqual([
			{
				date: "29 Mar",
				hours: ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"]
			}
			
		
		])
		
	})

})
