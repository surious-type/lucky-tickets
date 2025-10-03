function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = args.join('|');
        if (cache.has(key)) return cache.get(key);
        const res = fn.apply(this, args);
        cache.set(key, res);
        return res;
    };
}

function binom(n, k) {
    if (k < 0n || k > n) return 0n;
    if (k > n - k) k = n - k;
    let res = 1n;
    for (let i = 1n; i <= k; i++) {
        res = res * (n - k + i) / i;
    }
    return res;
}

function K_s_n(s, n, binom) {
    const sBI = BigInt(s);
    const nBI = BigInt(n);
    const all = binom(sBI + nBI - 1n, nBI - 1n);
    let diff = 0n;
    for (let kBI = 1n; kBI <= nBI; kBI++) {
        const term = binom(nBI, kBI) * binom(sBI - 10n * kBI + nBI - 1n, nBI - 1n);
        if (kBI % 2n === 0n) diff -= term;
        else diff += term;
    }
    return all - diff;
}

function luckyCount(N) {
    const n = N / 2;
    let C = 0n;
    const memoBinom = memoize(binom)
    for (let s = 0; s <= 9 * n; s++) {
        const val = K_s_n(s, n, memoBinom);
        C += val * val;
    }
    return C;
}

const N = 2756;
const result = luckyCount(N);
console.log(`Количество счастливых билетов для ${N}-значных = ${result.toString()}`);
