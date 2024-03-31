export class StringUtil {
    public static padLeadingZeroForSingleDigit(num: number): string {
        return num < 10 ? `0${num}` : num.toString()
    }
}