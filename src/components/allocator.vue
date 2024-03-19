<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { DraggableContainer } from 'vue3-draggable-resizable'

import AllocationElement from '~/components/allocation.vue'
import TimetableElement from '~/components/timetable.vue'

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
}

const props = withDefaults(defineProps<SacProps>(), {
    headerColor: "#987544",
    headerTextColor: "white",
    tableHeight: "800px",
})

const resources = defineModel("resources", { required: true, type: Array<Resource> })
const allocations = defineModel("allocations", { required: true, type: Array<Allocation> })

const allocTimeTable = ref(new AllocTimeTable(props.timetableStartTime, props.timetableEndTime, resources.value))
const activeRow = ref(-1)
const reRenderAllocCount = ref(0)
const reRenderTimeTableCount = ref(0)

function reRenderAlloc() {
    reRenderAllocCount.value++
}

function getTableHeightStyle() {
    return {
        height: props.tableHeight,
    }
}

function windowResizeHandler() {
    reRenderTimeTableCount.value++
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
                    :alloc="alloc" 
                    :allocTimeTable="allocTimeTable"
                    :minAllocMinutes="minAllocMinutes"
                    :maxAllocMinutes="maxAllocMinutes"
                    v-model:activeRow="activeRow" 
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