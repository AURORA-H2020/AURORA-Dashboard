export function secondsToDateTime(seconds: number) {
    const date = new Date(1970, 0, 1); // Epoch
    date.setSeconds(seconds);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}
