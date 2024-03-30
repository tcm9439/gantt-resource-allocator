
export class DateUtil{
    public static toDateOnlyString(date: Date): string {
        // DDMMM
        return date.getDate() + date.toDateString().substring(3, 7)
    }

    public static getMinutesDiff(time1: Date, time2: Date): number {
        return Math.floor((time2.getTime() - time1.getTime()) / 1000 / 60)
    }

    public static formatDate(date:Date, format:string): string {
        switch(format){
            case 'DDMMM':
                return DateUtil.toDateOnlyString(date)
           
        }
        return date.toISOString().split('T')[0]
    }
}