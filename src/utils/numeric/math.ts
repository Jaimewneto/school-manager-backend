export class MathUtils {
    static roundTo(num: number = 0, decimals = 2): number {
        if (!num) num = 0;
        num = Number(num);
        const factor = 10 ** decimals;
        return Math.round(num * factor) / factor;
    }

    static truncateTo(num: number = 0, decimals = 2): number {
        if (!num) num = 0;
        num = Number(num);
        const factor = 10 ** decimals;
        return Math.trunc(num * factor) / factor;
    }
}
