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
}

const allocationColorList: Map<AllocationElementColor, AllocationColorStyle> = new Map([
    [AllocationElementColor.ORANGE, {
        "background-color": "#FCE6CC",
        "border-color": "#CC9100"
    }],
    [AllocationElementColor.RED, {
        "background-color": "#F4CECC",
        "border-color": "#B15854"
    }],
    [AllocationElementColor.YELLOW, {
        "background-color": "#FDF1CC",
        "border-color": "#D2BB72"
    }],
    [AllocationElementColor.BLUE, {
        "background-color": "#DCE8FC",
        "border-color": "#7390C0"
    }],
    [AllocationElementColor.GREEN, {
        "background-color": "#D7E8D4",
        "border-color": "#A9CFB8"
    }],
    [AllocationElementColor.PURPLE, {
        "background-color": "#E0D5E7",
        "border-color": "#8D6CA1"
    }],
])

export function getAllocationResizableBoxStyle(hasCollision: boolean, color: AllocationElementColor): any {
    let style: any = allocationColorList.get(color)
    if (hasCollision) {
        return {
            "background-color": style["background-color"],
            "border-color": style["border-color"],
            "background": `repeating-linear-gradient( 45deg, ${style["border-color"]}, ${style["border-color"]} 1px, ${style["background-color"]} 2px, ${style["background-color"]} 30px )`
        }
    }
    return style
}