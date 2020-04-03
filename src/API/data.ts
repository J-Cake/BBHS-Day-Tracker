export default interface dataObj {
    day: string,
    dayCycle: string[],
    isHoliday: boolean,
    activeDays: number[],
    enabled: boolean,
    // dateEnabled: number,
    dateUpdated: number,
    holidays: {
        start: number,
        end: number
    }[],
    restartCounterAfterHoliday: boolean | number[]
}
