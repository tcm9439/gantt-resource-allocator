<script setup lang="ts">
import { Ref, ref } from 'vue'
import { Allocation } from "~/model/Allocation";
import { Resource } from "~/model/Resource";
import { TimeRange } from "~/model/TimeRange";
import { TimeTable } from "~/model/TimeTable";
import { TimeTableVM } from '~/view-model/TimeTableVM'


import TestTable from "~/components/TestTable.vue"

const start = new Date('2024-03-29T07:00:00.000Z');
const end = new Date('2024-03-29T08:00:00.000Z')
	
	let resources:Resource[] = []
	let timeTable: TimeTable
	let time_table_vm: TimeTableVM

	
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


</script>

<template>
    <h1>TESTING PAGE</h1>
    <div class="table-wrapper">
        <TestTable :timetable="time_table_vm"/>
    </div>
</template>

<style scoped>
.table-wrapper {
    width: 90vw;
    /* center the table */
    margin: auto;
}
</style>