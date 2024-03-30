// import { TimeRange } from "~/util/timeRange"
// import type { Resource } from "./resource"

import { type AllocTimeColLabel } from "~/types/common-type"
import { DateColumnLabel, HourColumnLabel, MinuteColumnLabel } from "~/types/common-type"

/**
 * header has 3 rows, one for date, one for hour, one for minute
 * use the array of (date, hours) tuple to generate the time column labels
 * 
 */
export class TimeColumnLabel {
    static readonly MINUTE_HEADER = ["00", "15", "30", "45"]
    public colLabels: Array<AllocTimeColLabel> = []

    constructor(colLabels: Array<AllocTimeColLabel>){
        this.colLabels = colLabels
    }

    /**
     * Calculates and returns the total number of time columns in the `colLabels` array.
     * Each time column represents a specific hour in a day.
     * 
     * @returns The total number of time columns.
     */
    getTotalNumberOfTimeColumns(): number {
        const initialValue = 0
        return this.colLabels.reduce((acc, cur) => acc + cur.hours.length, initialValue) * 4
    }

    // Array<[ key, label, colSpan]>
    // key = date-header+date+label
    getAllDates(): Array<DateColumnLabel> {
        let result: Array<DateColumnLabel> = []
        for (let i = 0; i < this.colLabels.length; i++) {
            result.push({
                vKey: `date-header-${this.colLabels[i].date}`,
                label: this.colLabels[i].date,
                colSpan: this.colLabels[i].hours.length * 4
            })
        }
        return result
    }
    
    // Array<[ key, label ]>
    // key = hour-header+date+label
    // it didn't specify the colSpan, it should be 4 (15 minutes per hour)
    getAllHours(): Array<HourColumnLabel> {
        let result: Array<HourColumnLabel> = []
        for (let i = 0; i < this.colLabels.length; i++) {
            for (let j = 0; j < this.colLabels[i].hours.length; j++) {
                result.push({
                    vKey: `hour-header-${this.colLabels[i].date}-${this.colLabels[i].hours[j]}`,
                    label: this.colLabels[i].hours[j]
                })
            }
        }
        return result
    }

    getAllMinutes(): Array<MinuteColumnLabel> {
        let result: Array<MinuteColumnLabel> = []
        for (let i = 0; i < this.colLabels.length; i++) {
            for (let j = 0; j < this.colLabels[i].hours.length; j++) {
                for (let k of TimeColumnLabel.MINUTE_HEADER) {
                    result.push({
                        vKey: `min-header-${this.colLabels[i].date}-${this.colLabels[i].hours[j]}-${k}`,
                        label: k
                    })
                }
            }
        }
        return result
    }
}

