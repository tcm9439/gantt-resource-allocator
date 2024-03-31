<script setup lang="ts">
import { ref, watch, onMounted, ComponentPublicInstance, inject } from 'vue'
import { HtmlElementBoundingRect } from '~/types/common-type'
import { TimeTableVM } from '~/view-model/TimeTableVM.ts'

let props = defineProps<{
    activeRow: number
    headerColor: string
    headerTextColor: string
    reloadPosition: number
}>()

// const allocTimeTable = defineModel('allocTimeTable', { required: true, type: TimeTableVM})
// const allocTimeTable
const time_table = inject('time_table') as TimeTableVM
const emits = defineEmits(['re-render-alloc'])

const timeColLabels = time_table.timeTable().getTableColumnLabel()
const timeColumnCount = timeColLabels.getTotalNumberOfTimeColumns()

// init cellRefList
// element ref to each time cell => cellRefList[resource row][timeIndex]
//

// store all of the cell showing in the table
const cellRefList: Array<Array<HTMLElement>> = []
// init cellRefList by number of resource x number of timeColumnCount
for (let i = 0; i < time_table.timeTable().resources().length; i++) {
    cellRefList[i] = []
    // for (let j=0; j <timeColumnCount; j++){
    //     cellRefList[i][j]=null
    // }
    cellRefList[i].length = timeColumnCount
}

console.log('Number of resource', time_table.timeTable().resources().length)
console.log('number of column ', timeColumnCount)

//time_table.initCellRefList(cellRefList, timeColumnCount)

// const resource_count = time_table.timeTable().getResourceRowLabel().length
//TimeTableVM.initCellRefList(cellRefList, resource_count, timeColumnCount)

const tableRef = ref<HTMLElement | null>(null)

function resourceClass(index: number) {
    let result = 'resource-row'
    if (index == props.activeRow) {
        result += ' active-resource'
    }
    if (index % 2 == 0) {
        result += ' even-resource-row'
    } else {
        result += ' odd-resource-row'
    }
    return result
}

function resourceCellClass(i: number) {
    let result = 'resource-cell'
    if (i % 4 == 0) {
        result += ' resource-cell-0-minute'
    }
    return result
}

function getFirstHeaderStyle(colSpan: number) {
    return {
        backgroundColor: props.headerColor,
        color: props.headerTextColor,
        width: colSpan * 30 + 'px',
        outline: props.headerTextColor + ' 1px solid',
    }
}

function getHeaderStyle() {
    return {
        backgroundColor: props.headerColor,
        color: props.headerTextColor,
        outline: props.headerTextColor + ' 1px solid',
    }
}

function initAllocTimeTable() {
    if (tableRef.value && cellRefList.length > 0) {
        // time_table.initValues(10, tableRef.value, cellRefList)

        const t_bounding_rect = tableRef.value.getBoundingClientRect()
        const tableBoundRect = <HtmlElementBoundingRect>{
            x: t_bounding_rect.x,
            y: t_bounding_rect.y,
            width: t_bounding_rect.width,
            height: t_bounding_rect.height,
        }

        time_table.setTableBoundRect(tableBoundRect)

        const column_count = time_table.timeTable().timeColumnCount()

        // update the latest cell bound rect to the allocTimeTable
        for (let i = 0; i < cellRefList.length; i++) {
            for (let j = 0; j < column_count; j++) {
                // cellBoundRect.y = 80 + i * 25
                // we have one row, should change the column x coordinate
                let temp_cellBoundRect = <HtmlElementBoundingRect>{
                    x: cellRefList[i][j].getBoundingClientRect().x,
                    y: cellRefList[i][j].getBoundingClientRect().y,
                    width: cellRefList[i][j].getBoundingClientRect().width,
                    height: cellRefList[i][j].getBoundingClientRect().height,
                }

                time_table.setCellBoundRect(i, j, temp_cellBoundRect)
            }
        }
        console.log('Time table initAllocTimeTable() end')
        time_table.onReady()
        emits('re-render-alloc')
    }
}

watch(
    () => props.reloadPosition,
    () => {
        initAllocTimeTable()
    },
)

onMounted(() => {
    initAllocTimeTable()
})

function setCellRef(index: number, i: number, el: Element | ComponentPublicInstance | null) {
    if (el instanceof Element) {
        cellRefList[index][i - 1] = el as HTMLElement
    }
}
</script>

<template>
    <div>
        <table class="timetable" ref="tableRef">
            <tr>
                <td class="header first-header main-lat-header" rowspan="3"></td>
                <td
                    v-for="day in timeColLabels.getAllDates()"
                    class="header first-header day-header"
                    :colspan="day.colSpan"
                    :style="getFirstHeaderStyle(day.colSpan)"
                    :key="day.vKey"
                >
                    <div>{{ day.label }}</div>
                </td>
            </tr>
            <tr :style="getHeaderStyle()">
                <td
                    v-for="hour in timeColLabels.getAllHours()"
                    colspan="4"
                    class="header hour-header"
                    :style="getHeaderStyle()"
                    :key="hour.vKey"
                >
                    <div class="hour-header">{{ hour.label }}</div>
                </td>
            </tr>
            <tr :style="getHeaderStyle()">
                <td
                    v-for="minute in timeColLabels.getAllMinutes()"
                    class="header min-header"
                    :style="getHeaderStyle()"
                    :key="minute.vKey"
                >
                    {{ minute.label }}
                </td>
            </tr>
            <tr
                v-for="resource in time_table.timeTable().getResourceRowLabel()"
                :key="resource.vKey"
                :class="resourceClass(resource.index)"
            >
                <td class="header col-resource-header" :style="getHeaderStyle()">{{ resource.label }}</td>
                <td
                    v-for="i in timeColumnCount"
                    :key="resource.vKey + '-' + i"
                    :ref="(element) => setCellRef(resource.index, i, element)"
                    :class="resourceCellClass(i)"
                ></td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
table {
    table-layout: fixed;
    width: 100%;
}

table,
td {
    border: 1pt solid lightgrey;
    border-collapse: collapse;
    text-align: center;
}

.header {
    font-weight: bold;
    outline: white 1px solid;
}

.first-header {
    height: 30px;
    position: sticky;
    top: 0;
    z-index: 11;
    line-height: 30px;
}

.day-header {
    height: 30px;
}

.hour-header {
    height: 30px;
    position: sticky;
    top: 30px;
    z-index: 11;
    width: 120px;
    line-height: 30px;
}

.min-header {
    width: 30px;
    height: 20px;
    line-height: 20px;
    position: sticky;
    top: 60px;
    z-index: 11;
}

.main-lat-header {
    width: 50px;
    outline: 0px;
    border: 0px;
}

.col-resource-header {
    position: sticky;
    left: 0px;
    z-index: 10;
}

.resource-row {
    height: 40px;
}

.resource-cell-0-minute {
    border-right: black 1pt solid;
}

tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

tr:nth-of-type(even).active-resource {
    background-color: #a1c7f1;
}

.active-resource {
    background-color: #a1c7f1;
}
</style>
