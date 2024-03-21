export enum AllocationElementColor {
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

const allocationColorList: Map<AllocationElementColor, AllocationColorStyle> = new Map([
    [AllocationElementColor.ORANGE, {
        "background-color": "#FCE6CC",
        "border-color": "#CC9100",
        "color": "black",
    }],
    [AllocationElementColor.RED, {
        "background-color": "#F4CECC",
        "border-color": "#B15854",
        "color": "black",
    }],
    [AllocationElementColor.YELLOW, {
        "background-color": "#FDF1CC",
        "border-color": "#D2BB72",
        "color": "black",
    }],
    [AllocationElementColor.BLUE, {
        "background-color": "#DCE8FC",
        "border-color": "#7390C0",
        "color": "black",
    }],
    [AllocationElementColor.GREEN, {
        "background-color": "#D7E8D4",
        "border-color": "#A9CFB8",
        "color": "black",
    }],
    [AllocationElementColor.PURPLE, {
        "background-color": "#E0D5E7",
        "border-color": "#8D6CA1",
        "color": "black",
    }],
])

function copyStyle(style: AllocationColorStyle): AllocationColorStyle {
    return {
        "background-color": style["background-color"],
        "border-color": style["border-color"],
        "color": style["color"],
    }
}

export function getAllocationResizableBoxStyle(hasCollision: boolean, isValid: boolean, color: AllocationElementColor): any {
    let style: any = copyStyle(allocationColorList.get(color) as AllocationColorStyle)
    if (hasCollision) {
        style['background'] = `repeating-linear-gradient( 45deg, ${style["border-color"]}, ${style["border-color"]} 1px, ${style["background-color"]} 2px, ${style["background-color"]} 30px )`
    }
    if (!isValid) {
        style['color'] = 'red'
        style['font-weight'] = 'bold'
    }
    return style
}