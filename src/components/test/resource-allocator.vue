<script setup lang="ts">
import { Ref, ref } from 'vue'
import ResourceAllocator from '~/components/allocator.vue'
import { Resource } from '~/model/Resource'
import { Allocation } from '~/model/Allocation'
import { AllocationColor } from '~/util/AllocationColor'
import { TimeRange } from '~/model/TimeRange'

const resource = ref([
    new Resource('1', '01A'),
    new Resource('2', '02A'),
    new Resource('3', '03A'),
    new Resource('4', '04A'),
    new Resource('5', '05A'),
    new Resource('6', '06A'),
    new Resource('7', '07A'),
    new Resource('8', '08A'),
    new Resource('9', '09A'),
    new Resource('10', '10A'),
    new Resource('11', '11A'),
    new Resource('12', '12A'),
    new Resource('13', '13A'),
    new Resource('14', '14A'),
    new Resource('15', '15A'),
    new Resource('16', '16A'),
    new Resource('17', '17A'),
    new Resource('18', '18A'),
    new Resource('19', '19A'),
    new Resource('20', '20A'),
    new Resource('21', '21A'),
    new Resource('22', '22A'),
    new Resource('23', '23A'),
]) as Ref<Array<Resource>>

function getDateTime(dayOffset: number, hour: number, minute: number): Date {
    const date = new Date()
    date.setDate(date.getDate() + dayOffset)
    date.setHours(hour, minute, 0, 0)
    return date
}

const allocations: Ref<Array<Allocation>> = ref([
    Allocation.create(
        '1',
        'Example 1',
        new TimeRange(getDateTime(-1, 23, 15), getDateTime(0, 1, 45)),
        AllocationColor.ORANGE,
    ).setResource(resource.value[0]),
    Allocation.create(
        '2',
        'Example 2',
        new TimeRange(getDateTime(0, 3, 20), getDateTime(0, 4, 30)),
        AllocationColor.BLUE,
    ).setResource(resource.value[1]),
    Allocation.create(
        '3',
        'Example 3',
        new TimeRange(getDateTime(0, 14, 40), getDateTime(0, 16, 40)),
        AllocationColor.YELLOW,
    ).setResource(resource.value[2]),
    Allocation.create(
        '4',
        'Example 4',
        new TimeRange(getDateTime(0, 8, 30), getDateTime(0, 9, 35)),
        AllocationColor.PURPLE,
    ).setResource(resource.value[3]),
    Allocation.create(
        '5',
        'Example 5',
        new TimeRange(getDateTime(0, 17, 20), getDateTime(0, 18, 45)),
        AllocationColor.ORANGE,
    ).setResource(resource.value[4]),
    Allocation.create(
        '6',
        'Example 6',
        new TimeRange(getDateTime(0, 9, 30), getDateTime(0, 11, 15)),
        AllocationColor.RED,
    ).setResource(resource.value[5]),
    Allocation.create(
        '7',
        'Example 7',
        new TimeRange(getDateTime(0, 2, 10), getDateTime(0, 3, 20)),
        AllocationColor.ORANGE,
    ).setResource(resource.value[6]),
    Allocation.create(
        '8',
        'Example 8',
        new TimeRange(getDateTime(0, 9, 20), getDateTime(0, 10, 25)),
        AllocationColor.BLUE,
    ).setResource(resource.value[7]),
]) as Ref<Array<Allocation>>

const allocTimeTableStartTime = getDateTime(-1, 23, 0)
const allocTimeTableEndTime = getDateTime(1, 1, 0)
const minAllocMinutes = 60
const maxAllocMinutes = 180

const editMode = ref(0) // 0: nothing, 1: confirm delete, 2: editing
const editingAlloc = ref(null) as Ref<Allocation | null>
const editingAllocName = ref('')
const editingAllocTime = ref('')
function onDelete(alloc: Allocation) {
    console.log('Delete', alloc)
    editMode.value = 1
    editingAlloc.value = alloc
}

function doDelete() {
    if (editingAlloc.value == null) {
        return
    }
    console.log('Do delete', editingAlloc.value)
    editingAlloc.value.resource()?.removeAllocation(editingAlloc.value)
    allocations.value.splice(allocations.value.indexOf(editingAlloc.value), 1)
    doCancel()
}

function onEdit(alloc: Allocation) {
    console.log('Edit', alloc)
    editingAlloc.value = alloc
    editingAllocName.value = alloc.name()
    // HH:MM format
    editingAllocTime.value = `${alloc.timeRange().start().getHours().toString().padStart(2, '0')}:${alloc.timeRange().start().getMinutes().toString().padStart(2, '0')}`
    editMode.value = 2
}

function doUpdate() {
    if (editingAlloc.value == null) {
        return
    }
    console.log('Do update', editingAlloc.value)
    editingAlloc.value.setName(editingAllocName.value)

    const timeParts = editingAllocTime.value.split(':')
    const newStartTime = new Date(editingAlloc.value.timeRange().start())
    newStartTime.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]))
    editingAlloc.value.timeRange().setStart(newStartTime)
    doCancel()
}

function doCancel() {
    console.log('Cancel')
    editMode.value = 0
    editingAlloc.value = null
    editingAllocName.value = ''
}

function allocValidation(alloc: Allocation): boolean {
    if (alloc.id() == '1') {
        // dummy constraint: start time cannot after some date
        if (alloc.timeRange().start().getTime() > getDateTime(0, 2, 15).getTime()) {
            console.log('Validation failed')
            return false
        }
    }
    return true
}
</script>

<template>
    <h1>Gantt Resource Allocator - Demo Page</h1>
    <div>
        <ul>
            <li>The allocation can be dragged and resized.</li>
            <li>
                Click on an allocation to see its time span in text. Right click on an allocation to trigger edit or
                delete UI. (The UI is implemented in this demo page but not in the component itself. The component only
                expose a callback to notify the edit/delete event.)
            </li>
            <li>
                Time Range: Yesterday 23:00 to Tomorrow 01:59. The allocation cannot be dragged outside this range. (But
                if user edit the Allocation object attribute, it is not checked.)
            </li>
            <li>Resource: 01A to 23A</li>
            <li>
                Each allocation should be at least 60 minutes and at most 180 minutes. So user is only allowed to resize
                the allocation box within this range. (But if user edit the Allocation object attribute, it is not
                checked.)
            </li>
            <li>The box style is changed if two or more allocations are overlapped.</li>
            <li>
                The text of the allocation name becomes red if the allocation is invalid according to the validation
                rule provided. (In this demo, allocation 1 cannot start after 02:15.)
            </li>
        </ul>
    </div>
    <div class="table-wrapper">
        <ResourceAllocator
            :resources="resource"
            :allocations="allocations"
            :timetableStartTime="allocTimeTableStartTime"
            :timetableEndTime="allocTimeTableEndTime"
            :minAllocMinutes="minAllocMinutes"
            :maxAllocMinutes="maxAllocMinutes"
            tableHeight="70vh"
            :allocationValidationCallback="allocValidation"
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
            <span>Name: </span>
            <input type="text" v-model="editingAllocName" />
            <span>Start time: </span>
            <input type="text" v-model="editingAllocTime" />
            <button @click="doUpdate">Confirm</button>
            <button @click="doCancel">Cancel</button>
        </div>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
}

.table-wrapper {
    width: 90vw;
    /* center the table */
    margin: auto;
}
</style>
