import type { Solve } from "./Timer"

export default function average(solve: Solve[]) {
    let timesTable = solve.map((element) => {
        if (element.penalty === 'none') return element.time
        if (element.penalty === '+2') return (element.time + 2000)
        return Infinity
    })
    timesTable.sort((a, b) => a - b)

    timesTable.pop()
    timesTable.shift()

    if (timesTable.includes(Infinity)) return 'DNF'
    
    const sum = timesTable.reduce((acc, curr) => acc + curr, 0)
    return (sum / (timesTable.length))
}