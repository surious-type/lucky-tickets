"use strict";

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

// === Твой код ===
function binom(n, k) {
  n = BigInt(n); k = BigInt(k);
  if (k < 0n || k > n) return 0n;
  if (k > n - k) k = n - k;
  let res = 1n;
  for (let i = 1n; i <= k; i++) {
    res = (res * (n - k + i)) / i;
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
  if (N % 2 !== 0) throw new Error("N должно быть чётным");
  const n = N / 2;
  let C = 0n;
  const memoBinom = memoize(binom)
  for (let s = 0; s <= 9 * n; s++) {
    const val = K_s_n(s, n, memoBinom);
    C += val * val;
  }
  return C;
}

// === Измерение времени ===
const MAX_MS = 60_000;     // порог ~1 минута
let lastOK = null;

for (let N = 6; ; N += 50) {
  const t0 = process.hrtime.bigint();
  const result = luckyCount(N);
  const t1 = process.hrtime.bigint();
  const ms = Number(t1 - t0) / 1e6;

  console.log(`N=${N}, время=${ms.toFixed(1)} мс`);

  if (ms > MAX_MS) {
    if (lastOK) {
      console.log(`\nПорог 60 с превышен на N=${N}. Максимальное N ≈ за 1 минуту: ${lastOK.N}`);
      console.log(`Kол-во счастливых билетов для N=${lastOK.N}: ${lastOK.result.toString()}`);
      console.log(`Время для N=${lastOK.N}: ${lastOK.ms.toFixed(1)} мс`);
    } else {
      console.log(`\nУже на N=${N} время > 60 с. Уменьшите N.`);
    }
    break;
  }
  lastOK = { N, ms, result };
}
