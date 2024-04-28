# Vue3 Gantt Resource Allocator

A gantt-like resource allocator vue 3 component. Each allocation box is draggable and resizable.

**Online demo:** [**Here**](https://tcm9439.github.io/gantt-resource-allocator/)

> **Caution!!**
> This component is client-side only. Do not use this component directly under SSR mode.
> E.g. If using Nuxt, warp the component with `import { Resource, Allocation, AllocationColor, TimeRange, ResourceAllocator } from "gantt-resource-allocator"` in its `<script>` by a `<client-only>` tag.

## Examples

### Vue Example

See [src/components/test/resource-allocator.vue](https://github.com/tcm9439/gantt-resource-allocator/blob/main/src/components/test/resource-allocator.vue).

### Nuxt Example

```vue
<template>
    <div style="margin: 20px">
        <client-only>
            <allocator />
        </client-only>
    </div>
</template>
```

components/allocator.vue

```vue
<script setup lang="ts">
import 'gantt-resource-allocator/style.css'
import { Resource, Allocation, AllocationColor, TimeRange, ResourceAllocator } from 'gantt-resource-allocator'

// ...
</script>

<template>
    <div class="table-wrapper">
        <ResourceAllocator
            :resources="resources"
            :allocations="allocations"
            :timetableStartTime="allocTimeTableStartTime"
            :timetableEndTime="allocTimeTableEndTime"
            :minAllocMinutes="minAllocMinutes"
            :maxAllocMinutes="maxAllocMinutes"
            tableHeight="90vh"
            :allocationValidationCallback="allocValidation"
            @delete="onDelete"
            @edit="onEdit"
        />
    </div>
</template>
```
