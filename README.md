# Vue3 Gantt Resource Allocator

## Usage

```ts
import "gantt-resource-allocator/style.css"
import { Resource, Allocation, AllocationColor, TimeRange, ResourceAllocator } from "gantt-resource-allocator"
```

```html
<ResourceAllocator 
    :resources="laterals" 
    :allocations="allocations" 
    :timetableStartTime="allocTimeTableStartTime" 
    :timetableEndTime="allocTimeTableEndTime" 
    :minAllocMinutes="minAllocMinutes" 
    :maxAllocMinutes="maxAllocMinutes"
    tableHeight="800px"
/>
```

> **Caution!!**
> This component is client-side only. Do not use this component directly under SSR mode.
> E.g. If using Nuxt, warp the component with `import { Resource, Allocation, AllocationColor, TimeRange, ResourceAllocator } from "gantt-resource-allocator"` in its `<script>` by a `<client-only>` tag.
