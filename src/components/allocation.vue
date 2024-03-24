<script setup lang="ts">
import { computed, ref, Ref, onMounted, watch } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import ContextMenu from '@imengyu/vue3-context-menu'

import AllocationSummary from '~/components/allocation_summary.vue'

import { Allocation } from '~/composables/allocation.ts'
import { getAllocationResizableBoxStyle } from '~/composables/allocationElementColor.ts'
import { AllocationPosition } from '~/composables/allocationPosition.ts'
import { AllocTimeTable } from '~/composables/allocationTimeTable.ts'

let props = defineProps<{
    allocTimeTable: AllocTimeTable
    minAllocMinutes: number,
    maxAllocMinutes: number,
    allocationValidationCallback: (alloc: Allocation) => boolean,
}>()

const alloc = defineModel("alloc", { required: true, type: Allocation })
const activeRow = defineModel("activeRow", { required: true, type: Number })

const emit = defineEmits<{
    (e: 'delete', alloc: Allocation): void
    (e: 'edit', alloc: Allocation): void
}>()

// ==== view data ====
const showInfoBox = ref(false)

const minWidth = props.allocTimeTable.getCellWidth(props.minAllocMinutes)
const maxWidth = props.allocTimeTable.getCellWidth(props.maxAllocMinutes)

const allocPos = ref(new AllocationPosition(props.allocTimeTable.getResourceIndex(alloc.value.resource))) as Ref<AllocationPosition>
const xMiddleStateValue = ref(allocPos.value.position.x)
const yMiddleStateValue = ref(allocPos.value.position.y)
const wMiddleStateValue = ref(allocPos.value.width)

const hasCollision = computed(() => {
    return alloc.value.hasCollision
})
const isValid = computed(() => {
    return alloc.value.valid
})

const xBoundToMovable = computed({
    get() {
        return xMiddleStateValue.value
    },
    set(newValue) {
        xMiddleStateValue.value = newValue
        allocPos.value.position.x = newValue
    }
})

const yBoundToMovable = computed({
    get() {
        return yMiddleStateValue.value
    },
    set(newValue) {
        yMiddleStateValue.value = newValue
        allocPos.value.position.y = newValue
    }
})

const width = computed({
    get() {
        return wMiddleStateValue.value
    },
    set(newValue) {
        wMiddleStateValue.value = newValue
        allocPos.value.width = newValue
    }
})

let posBeforeEdit = allocPos.value.copy()

const allocBoxStyle = ref(getAllocationResizableBoxStyle(hasCollision.value, isValid.value, alloc.value.color))
watch([hasCollision, isValid], () => {
    allocBoxStyle.value = getAllocationResizableBoxStyle(hasCollision.value, isValid.value, alloc.value.color)
})

watch([
        () => alloc.value.time, 
        () => alloc.value.time.start, 
        () => alloc.value.time.end,
    ], () => {
        allocPos.value.calculatePosition(alloc.value, props.allocTimeTable)
        forceReloadPos()
})

// ===== Helper function =====
function forceReloadPos() {
    xBoundToMovable.value = allocPos.value.position.x
    yBoundToMovable.value = allocPos.value.position.y
    width.value = allocPos.value.width
}

function validateChange() {
    if (width.value > maxWidth) {
        if (posBeforeEdit.width == maxWidth) {
            xBoundToMovable.value = posBeforeEdit.position.x
        } else {
            if (xBoundToMovable.value < posBeforeEdit.position.x) {
                // x is moved to the left, relocate x
                xBoundToMovable.value = posBeforeEdit.position.x + posBeforeEdit.width - maxWidth
            }
        }
        width.value = maxWidth
    }

    if (allocPos.value.position.x < props.allocTimeTable.minX ||
        allocPos.value.position.x + allocPos.value.width > props.allocTimeTable.maxX ||
        allocPos.value.position.y < props.allocTimeTable.minY ||
        allocPos.value.position.y + 30 > props.allocTimeTable.maxY
        ) {
        allocPos.value = posBeforeEdit
    } else {
        try {
            allocPos.value.relocatedToNearestGrid(alloc.value, props.allocTimeTable)
        } catch (e) {
            console.log('relocatedToNearestGrid error:', e)
            allocPos.value = posBeforeEdit
        }
    }

    // validation callback
    let isValidMove = props.allocationValidationCallback(alloc.value)
    alloc.value.valid = isValidMove
    // if (!isValidMove) {
    //     // revert to previous position
    //     allocPos.value = posBeforeEdit
    // }

    forceReloadPos()
}

// ===== Lifecycle Hooks =====
onMounted(() => {
    allocPos.value.calculatePosition(alloc.value, props.allocTimeTable)
    forceReloadPos()
})

// ===== Event Handlers =====

function onActivated() {
    showInfoBox.value = true
    activeRow.value = allocPos.value.getActiveRow(props.allocTimeTable)
}

function onDeactivated() {
    showInfoBox.value = false
    activeRow.value = -1
}

function onDragStart() {
    posBeforeEdit = allocPos.value.copy()
}

function onDragging() {
    showInfoBox.value = false
    activeRow.value = allocPos.value.getActiveRow(props.allocTimeTable)
}

function onDragEnd() {
    validateChange()
    showInfoBox.value = true
}

function onResizeStart() {
    showInfoBox.value = false
    posBeforeEdit = allocPos.value.copy()
}

function onResizing() {
}

function onResizeEnd() {
    validateChange()
    showInfoBox.value = true
}

function deleteAlloc(){
    emit('delete', alloc.value)
}

function editAlloc(){
    emit('edit', alloc.value)
}

function onContextMenu(e: MouseEvent) {
    //prevent the browser's default menu
    e.preventDefault()
    //show our menu
    ContextMenu.showContextMenu({
        x: e.x,
        y: e.y,
        items: [
            { 
                label: "Edit", 
                onClick: () => {
                    editAlloc()
                }
            },
            { 
                label: "Delete", 
                onClick: () => {
                    deleteAlloc()
                }
            },
        ]
    })
  }

</script>
<template>
    <div>
        <AllocationSummary 
            v-if="showInfoBox" 
            :alloc="alloc"
            :allocPos="allocPos"
            :tableMaxX="props.allocTimeTable.maxX"
        />
        <!-- a div that can be resized horizontally -->
        <!-- @contextmenu.prevent="onRightClick" -->
        <Vue3DraggableResizable
            class="allocation-resizable-box"
            :style="allocBoxStyle"
            @contextmenu="onContextMenu"
            :init-h="30"
            v-model:x="xBoundToMovable"
            v-model:y="yBoundToMovable"
            v-model:w="width"
            :minW="minWidth"
            :draggable="true"
            :resizable="true"
            :disabledH="true"
            :handles="['ml', 'mr']"
            @activated="onActivated"
            @deactivated="onDeactivated"
            @drag-start="onDragStart"
            @resize-start="onResizeStart"
            @dragging="onDragging"
            @resizing="onResizing"
            @drag-end="onDragEnd"
            @resize-end="onResizeEnd">
            <div class="allocation-name">
                {{ alloc.name }}
            </div>
        </Vue3DraggableResizable>
    </div>
</template>

<style scoped>
.allocation-name {
    width: 100%;
    height: 30px;
    text-align: center;
    line-height: 30px;
}
</style>
