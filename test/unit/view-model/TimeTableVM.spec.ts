import { describe, it, expect, beforeEach } from "vitest"
import { Allocation } from "~/model/Allocation";
import { Resource } from "~/model/Resource";
import { TimeRange } from "~/model/TimeRange";
import { TimeTable } from "~/model/TimeTable";
import { TimeTableVM } from '~/view-model/TimeTableVM'

// import { mount, VueWrapper } from "@vue/test-utils";
// import TestTable from "~/components/TestTable.vue"
import { HtmlElementBoundingRect } from "~/types/common-type";

describe('TimeTableVM', () => {
	// time table 07:00 - 08:00
	const start = new Date('2024-03-29T07:00:00.000Z');
	const end = new Date('2024-03-29T08:00:00.000Z')
	
	let resources:Resource[] = []
	let timeTable: TimeTable
	let time_table_vm: TimeTableVM

	beforeEach(() => {
		const a_start = new Date('2024-03-29T07:09:00.000Z');
		const a_end = new Date('2024-03-29T07:15:00.000Z')
		const a_time_range = new TimeRange(a_start, a_end)

		const allocation_a = new Allocation('A1', 'name_a1', a_time_range)

		const b_start = new Date('2024-03-29T08:00:00.000Z');
		const b_end = new Date('2024-03-29T08:14:00.000Z')
		const b_time_range = new TimeRange(b_start, b_end)

		const allocation_b = new Allocation('A2', 'name_a2', b_time_range)

		const resource = new Resource('R1', 'name_r1', [allocation_a, allocation_b])
		resources= [resource]

		timeTable = new TimeTable(start, end, resources)

		time_table_vm = new TimeTableVM(timeTable)

		
		const tableBoundRect = <HtmlElementBoundingRect>{ x: 0, y:0, width: 400, height: 300 }

		const cellBoundRect = <HtmlElementBoundingRect>{ x: 60, y:80, width: 100, height: 25 }
		
		
		time_table_vm.setTableBoundRect(tableBoundRect)
		const column_count = timeTable.timeColumnCount()
		for (let i = 0; i < column_count; i++) {
			// cellBoundRect.y = 80 + i * 25
			// we have one row, should change the column x coordinate
			let temp_cellBoundRect = { ...cellBoundRect }

			temp_cellBoundRect.x = 60 + i * 100

			time_table_vm.setCellBoundRect(0, i, temp_cellBoundRect)
		}

	})
	

	it('constructor', () => {
		expect(timeTable instanceof TimeTable).toBe(true)
	})

	// it('setCellRef / cellRef', async () => {

	// 	// write a test for cellRef
	// 	// by mounting the TestTable component
	// 	// and setting the cellRef

	// 	const wrapper: VueWrapper<any> = mount(TestTable, {
	// 	   props: {
	// 			timetable: time_table_vm,
	// 	   }
	// 	});

	// 	// const cellRef: Element = { current: null } as Element;
	// 	// time_table_vm.setCellRef(0, 0, cellRef)

	// 	//console.log(wrapper.html())

	// 	// get celRef(0,0)
	// 	expect(time_table_vm.cellRef(0,0) instanceof HTMLElement).toBe(true)
	// })

	it('setTableBoundRect / tableBoundRect', () => {
		const tableBoundRect = <HtmlElementBoundingRect>{ x: 0, y:0, width: 400, height: 300 }
		time_table_vm.setTableBoundRect(tableBoundRect)
		expect(time_table_vm.getTableBoundRect()).toStrictEqual(tableBoundRect)
	})

	it('setCellBoundRect / cellBoundRect', () => {
		const cellBoundRect = <HtmlElementBoundingRect>{ x: 60, y:80, width: 100, height: 25 }
		time_table_vm.setCellBoundRect(0,0,cellBoundRect)
		expect(time_table_vm.getCellBoundRect(0,0)).toStrictEqual(cellBoundRect)
	})

	it('initValues', async () => {
	

		time_table_vm.initValues()
		expect(time_table_vm.columnsY()).toStrictEqual([80]) // the first row
		expect(time_table_vm.rowsX()).toStrictEqual([60, 160,260,360,460,560,660,760]) // the first row, all column

		// assume each column has same width: 100, same as first cell
		expect(time_table_vm.columnWidth()).toBe(100)
		expect(time_table_vm.rowHeight()).toBe(25)
		expect(time_table_vm.minuteWidth()).toBeCloseTo(6.666666666666667) // 100 / 15

		expect(time_table_vm.colOffset()).toBe(60)
		expect(time_table_vm.rowOffset()).toBe(80)

		expect(time_table_vm.getItemTopPadding()).toBe(3.5) // 10% of 25 px + 1



		// const wrapper: VueWrapper<any> = await mount(TestTable, {
		// 	props: {
		// 		 timetable: time_table_vm,
		// 	}
		// });

		// console.log("wait wrapper mounted")
		// // confirm that the wrapper is mounted

		// await wrapper.vm.$nextTick() 
		
		// // sleep for 1 second
		// await new Promise(r => setTimeout(r, 1000));

		// await wrapper.vm.$nextTick() 
		// // vitest seems unable to render the table cell with height and width
		
		// // get the first cell
		// const cell00 = time_table_vm.cellRef(0,0)
		// const bounding = cell00.getBoundingClientRect()
		// console.log('hack bounding', bounding)


		// // console.log(wrapper.html())

		// console.log(time_table_vm.getTopLeftCorner());

		// console.log(time_table_vm.getBottomRightCorner());

	})

	it('getCellX', () => {

		// require initValues to be called first
		time_table_vm.initValues();

		const t1 = new Date('2024-03-29T07:00:00.000Z');

		expect(time_table_vm.getCellX(t1)).toBe(60.5)

		const t2 = new Date('2024-03-29T08:00:00.000Z');
		expect(time_table_vm.getCellX(t2)).toBe(60.5 + 4 * 100)
	})

	it('getCellWidth', () => {
		// require initValues to be called first
		time_table_vm.initValues();

		// e.g. 30 minute task
		expect(time_table_vm.getCellWidth(30)).toBe(199)
	})

	it('getTopLeftCorner', () => {
		// require initValues to be called first
		time_table_vm.initValues();

		expect(time_table_vm.getTopLeftCorner()).toStrictEqual([ 60, 80])
	})

	it('getBottomRightCorner', () => {
		// require initValues to be called first
		time_table_vm.initValues();

		expect(time_table_vm.getBottomRightCorner()).toStrictEqual([ 860,  105])
	})

	it('minX', () => {
		// require initValues to be called first
		time_table_vm.initValues();

		expect(time_table_vm.minX()).toBe(60)
	});

	it('minY', () => {
		// require initValues to be called first
		time_table_vm.initValues();

		expect(time_table_vm.minY()).toBe(80)
	});

	it('maxX', () => {
		// require initValues to be called first
		time_table_vm.initValues();

		expect(time_table_vm.maxX()).toBe(860)
	})

	it('maxY', () => {
		// require initValues to be called first
		time_table_vm.initValues();

		expect(time_table_vm.maxY()).toBe(105)
	})

	it('timeRange', () => {
		expect(time_table_vm.timeRange()).toStrictEqual(timeTable.timeRange())
	})




})


