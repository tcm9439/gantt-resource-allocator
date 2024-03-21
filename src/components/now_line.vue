<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { AllocTimeTable } from '~/composables/allocationTimeTable.ts'

let props = defineProps<{
    allocTimeTable: AllocTimeTable,
    timelineColor: string,
}>()

// fixed, relative to the header height
const lineY = props.allocTimeTable.rowOffset
// fixed, relative to the header height & table height
const height = props.allocTimeTable.maxY - props.allocTimeTable.rowOffset
const currentTimeInRange = ref(false)
let timeoutID: number | null = null
let currentTime = new Date()

const lineStyle = ref({
    height: height + 'px',
    left: '0 px',
    top: lineY + 'px',
    borderLeft: `2px solid ${props.timelineColor}`,
})

function calculateXByCurrentTime(){
    let inRange = checkCurrentTimeInRange()
    if (inRange) {
        let lineX = Math.round(props.allocTimeTable.getCellX(currentTime))
        lineStyle.value = {
            height: height + 'px',
            left: lineX + 'px',
            top: lineY + 'px',
            borderLeft: `2px solid ${props.timelineColor}`,
        }
    }
    currentTimeInRange.value = inRange
}

function checkCurrentTimeInRange(): boolean {
    currentTime = new Date()
    return props.allocTimeTable.timeRange.isTimeWithinThis(currentTime)
}

function fireRefresh() {
    let secondTillNextMinute = 60 - currentTime.getSeconds()
    if (timeoutID) {
        clearTimeout(timeoutID)
    }
    timeoutID = setTimeout(() => {
        calculateXByCurrentTime()
        fireRefresh()
    }, secondTillNextMinute * 1000)
}

onMounted(() => {
    calculateXByCurrentTime()
    fireRefresh()

})

onUnmounted(() => {
    if (timeoutID) {
        clearTimeout(timeoutID)
    }
})
</script>

<template>
    <div 
        v-if="currentTimeInRange"
        class="allocation-timetable-now-line" :style="lineStyle" >
    </div>
</template>

<style scoped>
.allocation-timetable-now-line {
    position: absolute;
    z-index: 9;
}
</style>