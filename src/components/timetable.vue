<script setup lang="ts">
import { ref, watch, onMounted, ComponentPublicInstance } from 'vue'
import { AllocTimeTable } from '~/composables/allocationTimeTable.ts'

let props = defineProps<{
    activeRow: number,
    headerColor: string,
    headerTextColor: string,
    reloadPosition: number,
}>()

const allocTimeTable = defineModel('allocTimeTable', { required: true, type: AllocTimeTable})
const emits = defineEmits(['re-render-alloc'])

const timeColLabels = allocTimeTable.value.getTableHourLabel()
const timColCount = timeColLabels.getTotalNumberOfTimeColumns()

// init cellRefList
const cellRefList: Array<Array<HTMLElement>> = []
allocTimeTable.value.initCellRefList(cellRefList, timColCount)
const tableRef = ref<HTMLElement | null>(null)

function resourceClass(index: number) {
    let result = "resource-row"
    if (index == props.activeRow) {
        result += " active-resource"
    }
    if (index % 2 == 0) {
        result += " even-resource-row"
    } else {
        result += " odd-resource-row"
    }
    return result
}

function resourceCellClass(i: number) {
    let result = "resource-cell"
    if (i % 4 == 0) {
        result += " resource-cell-0-minute"
    }
    return result
}

function getFirstHeaderStyle(colSpan: number) {
    return {
        backgroundColor: props.headerColor,
        color: props.headerTextColor,
        width: colSpan * 30 + "px",
        outline: props.headerTextColor + " 1px solid",
    }
}

function getHeaderStyle() {
    return {
        backgroundColor: props.headerColor,
        color: props.headerTextColor,
        outline: props.headerTextColor + " 1px solid",
    }
}

function initAllocTimeTable() {
    if (tableRef.value && cellRefList.length > 0){
        allocTimeTable.value.initValues(10, tableRef.value, cellRefList)
        emits("re-render-alloc")
    }
}

watch(() => props.reloadPosition, () => {
    initAllocTimeTable()
})

onMounted(() => {
    initAllocTimeTable()
})

function setCellRef(index: number, i: number, el: Element | ComponentPublicInstance | null) {
    if (el instanceof Element){
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
                    :key="day.vKey">
                    <div>{{ day.label }}</div>
                </td>
            </tr>
            <tr :style="getHeaderStyle()">
                <td
                    v-for="hour in timeColLabels.getAllHours()"
                    colspan="4"
                    class="header hour-header"
                    :style="getHeaderStyle()"
                    :key="hour.vKey">
                    <div class="hour-header">{{ hour.label }}</div>
                </td>
            </tr>
            <tr :style="getHeaderStyle()">
                <td 
                    v-for="minute in timeColLabels.getAllMinutes()"
                    class="header min-header" 
                    :style="getHeaderStyle()" 
                    :key="minute.vKey">
                    {{ minute.label }}
                </td>
            </tr>
            <tr v-for="resource in allocTimeTable.getResourceRowLabel()" :key="resource.vKey" :class="resourceClass(resource.index)">
                <td class="header col-resource-header" :style="getHeaderStyle()">{{ resource.label }}</td>
                <td
                    v-for="i in timColCount"
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

table, td {
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
