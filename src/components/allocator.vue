<script setup lang="ts">
// context menu css
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

// make event listeners passive to improve scrolling performance (prevent chrome warning)
// suspected the resize event listener & the draggable-resizable library is causing the warning
import 'default-passive-events'

import { DraggableContainer } from 'vue3-draggable-resizable'

import { ref, onMounted, onUnmounted, provide } from 'vue'

// the Vue Component for Allocation
import AllocationElement from '~/components/allocation.vue'
import TimetableElement from '~/components/timetable.vue'
import NowLine from '~/components/now-line.vue'

import { Allocation } from '~/model/Allocation.ts'
import { TimeTableVM } from '~/view-model/TimeTableVM.ts'
import { TimeTable } from '~/model/TimeTable.ts'
import { Resource } from '~/model/Resource.ts'

export interface SacProps {
    timetableStartTime: Date
    timetableEndTime: Date
    minAllocMinutes: number
    maxAllocMinutes: number
    headerColor?: string
    headerTextColor?: string
    tableHeight?: string
    currentTimelineColor?: string
    allocationValidationCallback?: (alloc: Allocation) => boolean
}

// optional properties default values
const props = withDefaults(defineProps<SacProps>(), {
    headerColor: '#987544',
    headerTextColor: 'white',
    tableHeight: '800px',
    currentTimelineColor: 'red',
    allocationValidationCallback: (_alloc: Allocation) => true,
})

const resources = defineModel('resources', { required: true, type: Array<Resource> })
const allocations = defineModel('allocations', { required: true, type: Array<Allocation> })

// emit the events triggered by the context menu
const emit = defineEmits<{
    (e: 'delete', alloc: Allocation): void
    (e: 'edit', alloc: Allocation): void
}>()

const time_table_model = new TimeTable(props.timetableStartTime, props.timetableEndTime, resources.value)
const time_table = new TimeTableVM(time_table_model)

provide('time_table', time_table)

const activeRow = ref(-1)
const reRenderAllocCount = ref(0)
const reRenderNowLineCount = ref(0)
const reRenderTimeTableCount = ref(0)

// trigger re-render of Allocation & NowLine due to changes in (coordinate system of) the TimeTable
function reRenderAlloc() {
    reRenderAllocCount.value++
    reRenderNowLineCount.value++
}

function getTableHeightStyle() {
    return {
        height: props.tableHeight,
    }
}

// when window is resized, re-render the TimeTable as the width/height/x/y may have changed
function windowResizeHandler() {
    reRenderTimeTableCount.value++
}

onMounted(() => {
    window.addEventListener('resize', windowResizeHandler)
})

onUnmounted(() => {
    window.removeEventListener('resize', windowResizeHandler)
})
</script>

<template>
    <div class="table-warper" :style="getTableHeightStyle()">
        <DraggableContainer :referenceLineVisible="false">
            <NowLine :key="'now' + reRenderNowLineCount" :timeline-color="props.currentTimelineColor" />

            <TimetableElement
                class="timetable"
                :reloadPosition="reRenderTimeTableCount"
                :activeRow="activeRow"
                :resources="resources"
                :headerColor="props.headerColor"
                :headerTextColor="props.headerTextColor"
                @re-render-alloc="reRenderAlloc"
            />

            <div :key="reRenderAllocCount">
                <AllocationElement
                    v-for="alloc in allocations"
                    :key="alloc.id()"
                    :alloc="alloc"
                    :minAllocMinutes="minAllocMinutes"
                    :maxAllocMinutes="maxAllocMinutes"
                    v-model:activeRow="activeRow"
                    :allocationValidationCallback="props.allocationValidationCallback"
                    @delete="(allocToDelete) => emit('delete', allocToDelete)"
                    @edit="(allocToEdit) => emit('edit', allocToEdit)"
                />
            </div>
        </DraggableContainer>
    </div>
</template>

<style scoped>
.table-warper {
    overflow: auto;
}

.timetable {
    max-height: 100%;
}
</style>
