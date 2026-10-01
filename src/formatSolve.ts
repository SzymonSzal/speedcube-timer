import formatTime from "./formatTime";
import type { Solve } from "./Timer";

export default function formatSolve(solve: Solve) {
    if (solve.penalty === 'none') return formatTime(solve.time)
    if (solve.penalty === '+2') return formatTime(solve.time + 2000) + '+'
    return `DNF(${formatTime(solve.time)})`
}