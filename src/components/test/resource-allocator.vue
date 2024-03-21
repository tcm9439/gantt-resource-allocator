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

const allocTimeTableStartTime = new Date(2024, 1, 14, 23, 0)
const allocTimeTableEndTime = new Date(2024, 1, 16, 1, 0)
const minAllocMinutes = 60
const maxAllocMinutes = 180

const editMode = ref(0) // 0: nothing, 1: confirm delete, 2: editing
const editingAlloc = ref<Allocation | null>(null)
const editingAllocName = ref("")
function onDelete(alloc: Allocation) {
    console.log("Delete", alloc)
    editMode.value = 1
    editingAlloc.value = alloc
}

function doDelete() {
    if (editingAlloc.value == null) {
        return
    }
    console.log("Do delete", editingAlloc.value)
    editingAlloc.value.resource?.removeAllocation(editingAlloc.value)
    allocations.value.splice(allocations.value.indexOf(editingAlloc.value), 1)
    doCancel()
}

function onEdit(alloc: Allocation) {
    console.log("Edit", alloc)
    editingAlloc.value = alloc
    editingAllocName.value = alloc.name
    editMode.value = 2
}

function doUpdate() {
    if (editingAlloc.value == null) {
        return
    }
    console.log("Do update", editingAlloc.value)
    editingAlloc.value.name = editingAllocName.value
    doCancel()
}

function doCancel() {
    console.log("Cancel")
    editMode.value = 0
    editingAlloc.value = null
    editingAllocName.value = ""
}
</script>

<template>
    <h1>TESTING PAGE</h1>
    <div class="table-wrapper">
    <ResourceResourceAllocator 
        :resources="laterals" 
        :allocations="allocations" 
        :timetableStartTime="allocTimeTableStartTime" 
        :timetableEndTime="allocTimeTableEndTime" 
        :minAllocMinutes="minAllocMinutes" 
        :maxAllocMinutes="maxAllocMinutes"
        tableHeight="70vh"
        @delete="onDelete"
        @edit="onEdit"
    />
    </div>
    <div style="margin: 20px">
        <div v-if="editMode == 1">
            <p>Are you sure you want to delete this allocation?</p>
            <button @click="doDelete">Yes</button>
            <button @click="doCancel">No</button>
        </div>
        <div v-else-if="editMode == 2">
            <p>Editing allocation</p>
            <input type="text" v-model="editingAllocName">
            <button @click="doUpdate">Confirm</button>
            <button @click="doCancel">Cancel</button>
        </div>
    </div>
</template>

<style scoped>
.table-wrapper {
    width: 90vw;
    /* center the table */
    margin: auto;
}
</style>