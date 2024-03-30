import { Resource } from './Resource'
import { TimeRange } from './TimeRange'
import { TimeColumnLabel } from '~/view-model/TimeColumnLabel';

import { ResourceRowLabel } from '~/types/common-type'


// TimeTable formerly AllocTimeTable

/**
 * a TimeTable is a table that represents a time range and resources
 */
export class TimeTable {
    /**
     * the resources in the time table
     * each resource is a row in the time table
     */
    private _resources: Array<Resource> = []
    /**
     * the time range of the time table
     * the time range is the time range of the time table, 
     * for the Columns of the time table
     */
    private _timeRange: TimeRange

    // default 5 minutes
    // the precision of the time table
    public _minutePrecision: number = 5

    constructor(startTime: Date, endTime: Date, _resources: Array<Resource>, minutePrecision?: number) {
        this._timeRange = new TimeRange(startTime, endTime)
        this._resources = _resources
        this._minutePrecision = minutePrecision || 5
    }


    public timeRange(): TimeRange {
        return this._timeRange
    }

    public minutePrecision(): number {
        return this._minutePrecision
    }

    public resources(): Array<Resource> {
        return this._resources
    }



    /**
     * return all the resources label in the time table
     * array of [ 
     *   {
     *      vKey: string, 
     *      label: string, 
     *      index: number
     *   }
     * ]
     * vKey is the unique key for the resource (resource id)
     * label is the name of the resource (resource name)
     * @returns 
     */
    public getResourceRowLabel(): Array<ResourceRowLabel> {
        let result: Array<ResourceRowLabel> = []
        for (let i = 0; i < this._resources.length; i++) {
            result.push({ 
                vKey: this._resources[i].id(), 
                label: this._resources[i].name(), 
                index: i })
        }
        return result
    }


    public getResourceByIndex(index: number): Resource {
        return this._resources[index]
    }


    /**
     * return the (row) index of the resource in the time table
     * @param resource 
     * @returns 
     */
    public getResourceIndex(resource: Resource | undefined): number {
        if (!resource) {
            return 0
        }
        return this._resources.indexOf(resource) 
    }

    private _time_column_label?: TimeColumnLabel
    /**
     * get column labels based on the time range.
     * 
     * first find the (date, hours) tuple in the time range,
     * the return the column label for the time table
     * @returns 
     */
    public getTableColumnLabel(): TimeColumnLabel {
        //let result: Array<AllocTimeColLabel> = []
        // for each hour within time range
        // let dayIndex = -1
        // let currentDate = new Date(this._timeRange.start())
        // let lastDate: null | Date = null
        // while (currentDate <= this._timeRange.end()) {
        //     if (!lastDate || lastDate.getDate() != currentDate.getDate()){
        //         currentDate.setDate(currentDate.getDate() + dayIndex)
        //         result.push(<AllocTimeColLabel>{ date: DateUtil.toDateOnlyString(currentDate), hours: [] })
        //         dayIndex++
        //     }
        //     const tmp_hour = StringUtil.padLeadingZeroForSingleDigit(currentDate.getHours())
        //     console.log('tmp_hour', currentDate, tmp_hour);
        //     result[dayIndex].hours.push(StringUtil.padLeadingZeroForSingleDigit(currentDate.getHours()))
        //     lastDate = new Date(currentDate)
        //     currentDate.setHours(currentDate.getHours() + 1)
        // }
        // console.log('xxx', result);

        const result = this._timeRange.stepsByDateAndHour()

        this._time_column_label = new TimeColumnLabel(result)
        return this._time_column_label
    }

    /**
     * the number of time columns in the time table
     * @returns 
     */
    public timeColumnCount(): number {
        if (!this._time_column_label) {
            this.getTableColumnLabel()
        }
        return this._time_column_label?.getTotalNumberOfTimeColumns() || 0
    }

  

}
