/**
 * Color & style for the draggable resizable allocation box
 */

export enum AllocationColor {
    ORANGE,
    RED,
    YELLOW,
    BLUE,
    GREEN,
    PURPLE,
}

type AllocationColorStyle = {
    "background-color": string
    "border-color": string
    "color": string
}

const allocationColorList: Map<AllocationColor, AllocationColorStyle> = new Map([
    [AllocationColor.ORANGE, {
        "background-color": "#FCE6CC",
        "border-color": "#CC9100",
        "color": "black",
    }],
    [AllocationColor.RED, {
        "background-color": "#F4CECC",
        "border-color": "#B15854",
        "color": "black",
    }],
    [AllocationColor.YELLOW, {
        "background-color": "#FDF1CC",
        "border-color": "#D2BB72",
        "color": "black",
    }],
    [AllocationColor.BLUE, {
        "background-color": "#DCE8FC",
        "border-color": "#7390C0",
        "color": "black",
    }],
    [AllocationColor.GREEN, {
        "background-color": "#D7E8D4",
        "border-color": "#A9CFB8",
        "color": "black",
    }],
    [AllocationColor.PURPLE, {
        "background-color": "#E0D5E7",
        "border-color": "#8D6CA1",
        "color": "black",
    }],
])

function copyStyle(style: AllocationColorStyle): AllocationColorStyle {
    return { ...style }
}

export function getAllocationResizableBoxStyle(hasCollision: boolean, isValid: boolean, color: AllocationColor): any {
    let style: any = copyStyle(allocationColorList.get(color) as AllocationColorStyle)

    if (hasCollision) {
        // set striped background
        style['background'] = `repeating-linear-gradient( 45deg, ${style["border-color"]}, ${style["border-color"]} 1px, ${style["background-color"]} 2px, ${style["background-color"]} 30px )`
    }

    if (!isValid) {
        // set alert style
        style['color'] = 'red'
        style['font-weight'] = 'bold'
    }
    return style
}