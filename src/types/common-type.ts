export type AllocTimeColLabel = {
    date: string
    hours: Array<string>
}

export type ResourceRowLabel = {
    vKey: string
    label: string
    index: number
}

/**
 * header has 3 rows, one for date, one for hour, one for minute
 */
export type DateColumnLabel = {
    vKey: string
    label: string
    colSpan: number
}

export type HourColumnLabel = {
    vKey: string
    label: string
}

export type MinuteColumnLabel = {
    vKey: string
    label: string
}

export type HtmlElementBoundingRect = {
    x: number
    y: number
    width: number
    height: number
}
