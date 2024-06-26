<script setup lang="ts">
import { computed } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import { Allocation } from '~/model/Allocation.ts'
import { AllocationPosition } from '~/model/AllocationPosition.ts'

let props = defineProps<{
    alloc: Allocation
    allocPos: AllocationPosition
    tableMaxX: number
}>()

const infoWidth = 150
const infoYOffset = 30

let infoX = computed(() => {
    let midInfoX = props.allocPos.position().x() + props.allocPos.width() / 2 - infoWidth / 2
    // if midInfoX is out of bounds, move it to the edge
    if (midInfoX < 0) {
        return 0
    } else if (midInfoX + infoWidth > props.tableMaxX) {
        return props.tableMaxX - infoWidth
    } else {
        return midInfoX
    }
})

let infoY = computed(() => {
    return props.allocPos.position().y() - infoYOffset
})

let startTimeDisplay = computed(() => {
    return Allocation.toDisplayString(props.alloc.timeRange().start())
})

let endTimeDisplay = computed(() => {
    return Allocation.toDisplayString(props.alloc.timeRange().end())
})
</script>

<template>
    <Vue3DraggableResizable class="allocation-info-box" :x="infoX" :y="infoY" :draggable="false" :resizable="false">
        <div>{{ startTimeDisplay }} - {{ endTimeDisplay }}</div>
    </Vue3DraggableResizable>
</template>

<style scoped>
.allocation-info-box {
    width: 150px;
    background-color: rgba(211, 211, 211, 0.9);
    text-align: center;
    z-index: 12;
    border-radius: 5px;
}
</style>
