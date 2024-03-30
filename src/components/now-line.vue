<script setup lang="ts">
import { onMounted, onUnmounted, ref, inject } from 'vue'
import { TimeTableVM } from '~/view-model/TimeTableVM.ts'

let props = defineProps<{
    // allocTimeTable: AllocTimeTable,
    timelineColor: string,
}>()

const time_table = inject('time_table') as TimeTableVM

// const time_table = inject('time_table') as TimeTableVM
// const time_table = props.allocTimeTable

// fixed, relative to the header height
const lineY = time_table.rowOffset()
// fixed, relative to the header height & table height
const height = time_table.maxY() - time_table.rowOffset()
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
        let lineX = Math.round(time_table.getCellX(currentTime))
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
    return time_table.timeRange().contains(currentTime)
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

time_table.registerOnReadyListener(() => {
    console.log('now-line call after time table is ready')
    calculateXByCurrentTime()
    console.log('now-line mounted222', time_table.getCellX(currentTime))
    fireRefresh()
})


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
    <div v-if="currentTimeInRange"
        class="allocation-timetable-now-line" :style="lineStyle" >
    </div>
</template>

<style scoped>
.allocation-timetable-now-line {
    position: absolute;
    z-index: 9;
}
</style>