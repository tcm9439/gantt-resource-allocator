<script setup lang="ts">
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'

import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { DraggableContainer } from 'vue3-draggable-resizable'
import 'default-passive-events'

import AllocationElement from '~/components/allocation.vue'
import TimetableElement from '~/components/timetable.vue'
import NowLine from '~/components/now_line.vue'

import { Allocation } from '~/composables/allocation.ts'
import { AllocTimeTable } from '~/composables/allocationTimeTable.ts'
import { Resource } from '~/composables/resource.ts'

export interface SacProps {
    timetableStartTime: Date,
    timetableEndTime: Date,
    minAllocMinutes: number,
    maxAllocMinutes: number,
    headerColor?: string,
    headerTextColor?: string,
    tableHeight?: string,
    currentTimelineColor?: string,
    allocationValidationCallback?: (alloc: Allocation) => boolean,
}

// optional properties default values
const props = withDefaults(defineProps<SacProps>(), {
    headerColor: "#987544",
    headerTextColor: "white",
    tableHeight: "800px",
    currentTimelineColor: "red",
    allocationValidationCallback: (_alloc: Allocation) => true,
})

const resources = defineModel("resources", { required: true, type: Array<Resource> })
const allocations = defineModel("allocations", { required: true, type: Array<Allocation> })

const emit = defineEmits<{
    (e: 'delete', alloc: Allocation): void
    (e: 'edit', alloc: Allocation): void
}>()

const allocTimeTable = ref(new AllocTimeTable(props.timetableStartTime, props.timetableEndTime, resources.value)) as Ref<AllocTimeTable>
const activeRow = ref(-1)
const reRenderAllocCount = ref(0)
const reRenderNowLineCount = ref(0)
const reRenderTimeTableCount = ref(0)

function reRenderAlloc() {
    reRenderAllocCount.value++
    reRenderNowLineCount.value++
}

function getTableHeightStyle() {
    return {
        height: props.tableHeight,
    }
}

function windowResizeHandler() {
    reRenderTimeTableCount.value++
    reRenderNowLineCount.value++
}

onMounted(() => {
    window.addEventListener("resize", windowResizeHandler)
})

onUnmounted(() => {
    window.removeEventListener("resize", windowResizeHandler)
})
</script>

<template>
    <div class="table-warper" :style="getTableHeightStyle()">
        <DraggableContainer :referenceLineVisible="false">
            <NowLine 
                :key="'now' + reRenderNowLineCount"
                :allocTimeTable="allocTimeTable"
                :timeline-color="props.currentTimelineColor"
            />

            <TimetableElement 
                class="timetable"
                :reloadPosition="reRenderTimeTableCount"
                :activeRow="activeRow" 
                :resources="resources"
                :headerColor="props.headerColor"
                :headerTextColor="props.headerTextColor"
                v-model:allocTimeTable="allocTimeTable" 
                @re-render-alloc="reRenderAlloc"
            />
            
            <div :key="reRenderAllocCount">
                <AllocationElement 
                    v-for="alloc in allocations" 
                    :key="alloc.id"
                    :alloc="alloc" 
                    :allocTimeTable="allocTimeTable"
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