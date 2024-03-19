<script setup lang="ts">
import { Ref, ref } from 'vue'
import ResourceResourceAllocator from '~/components/allocator.vue'
import { Resource } from '~/composables/resource'
import { Allocation } from '~/composables/allocation'
import { AllocationElementColor } from '~/composables/allocationElementColor'
import { TimeRange } from '~/composables/util/timeRange'

const laterals: Ref<Array<Resource>> = ref([
    new Resource("1", "01A"),
    new Resource("2", "02A"),
    new Resource("3", "03A"),
    new Resource("4", "04A"),
    new Resource("5", "05A"),
    new Resource("6", "06A"),
    new Resource("7", "07A"),
    new Resource("8", "08A"),
    new Resource("9", "09A"),
    new Resource("10", "10A"),
    new Resource("11", "11A"),
    new Resource("12", "12A"),
    new Resource("13", "13A"),
    new Resource("14", "14A"),
    new Resource("15", "15A"),
    new Resource("16", "16A"),
    new Resource("17", "17A"),
    new Resource("18", "18A"),
    new Resource("19", "19A"),
    new Resource("20", "20A"),
    new Resource("21", "21A"),
    new Resource("22", "22A"),
    new Resource("23", "23A"),
])

const allocations: Ref<Array<Allocation>> = ref([
    new Allocation("1", "Example 1", new TimeRange(new Date(2024, 1, 14, 23, 15), new Date(2024, 1, 15, 1, 45)), laterals.value[0], AllocationElementColor.ORANGE),
    new Allocation("2", "Example 2", new TimeRange(new Date(2024, 1, 15, 3, 20), new Date(2024, 1, 15, 4, 30)), laterals.value[1], AllocationElementColor.BLUE),
    new Allocation("3", "Example 3", new TimeRange(new Date(2024, 1, 15, 14, 40), new Date(2024, 1, 15, 16, 40)), laterals.value[2], AllocationElementColor.YELLOW),
    new Allocation("4", "Example 4", new TimeRange(new Date(2024, 1, 15, 8, 30), new Date(2024, 1, 15, 9, 35)), laterals.value[3], AllocationElementColor.PURPLE),
    new Allocation("5", "Example 5", new TimeRange(new Date(2024, 1, 15, 17, 20), new Date(2024, 1, 15, 18, 45)), laterals.value[4], AllocationElementColor.ORANGE),
    new Allocation("6", "Example 6", new TimeRange(new Date(2024, 1, 15, 9, 30), new Date(2024, 1, 15, 11, 15)), laterals.value[5], AllocationElementColor.RED),
    new Allocation("7", "Example 7", new TimeRange(new Date(2024, 1, 15, 2, 10), new Date(2024, 1, 15, 3, 20)), laterals.value[6], AllocationElementColor.ORANGE),   
    new Allocation("8", "Example 8", new TimeRange(new Date(2024, 1, 15, 9, 20), new Date(2024, 1, 15, 10, 25)), laterals.value[7], AllocationElementColor.BLUE),
])

for (let alloc of allocations.value) {
    alloc.resource?.allocations.push(alloc)
}

const allocTimeTableStartTime = new Date(2024, 1, 14, 23, 0)
const allocTimeTableEndTime = new Date(2024, 1, 16, 1, 0)
const minAllocMinutes = 60
const maxAllocMinutes = 180
</script>

<template>
    <h1>TESTING PAGE</h1>
    <ResourceResourceAllocator 
        :resources="laterals" 
        :allocations="allocations" 
        :timetableStartTime="allocTimeTableStartTime" 
        :timetableEndTime="allocTimeTableEndTime" 
        :minAllocMinutes="minAllocMinutes" 
        :maxAllocMinutes="maxAllocMinutes"
        tableHeight="800px"
    />
    <div class="text-area">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    </div>
</template>

<style scoped>
.text-area {
    padding: 10px;
}
</style>