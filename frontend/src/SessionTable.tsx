import average from "./average"
import formatTime from "./formatTime"
import formatSolve from "./formatSolve"
import type {Solve} from "./Timer"

interface TableProps{
    times: Solve[]
    onTimeClick: (solve: Solve) => void
}

function SessionTable(props: TableProps) {
    return(
        <div>
            <table className="w-full text-left border-collapse text-zinc-300">
                <thead>
                    <tr>
                        <th className="pb-3 font-semibold text-zinc-400 border-b border-zinc-700">numer</th>
                        <th className="pb-3 font-semibold text-zinc-400 border-b border-zinc-700">czas</th>
                        <th className="pb-3 font-semibold text-zinc-400 border-b border-zinc-700">ao5</th>
                        <th className="pb-3 font-semibold text-zinc-400 border-b border-zinc-700">a012</th>
                    </tr>
                </thead>
                <tbody>
                    {props.times.map((solve, index) => {
                        const ao5 = average(props.times.slice(index-4, index + 1))
                        const ao12 = average(props.times.slice(index-11, index + 1))
                        return (
                            <tr 
                            key={solve.id}
                            className="border-b border-zinc-800/50 hover:bg-zinc-800/80 transition-colors"
                            >
                                <td className="py-2">{index + 1}</td>
                                <td 
                                className="py-2 font-mono text-zinc-100 cursor-pointer hover:text-indigo-400 transition-colors" 
                                onClick={() => props.onTimeClick(solve)}
                                >
                                    {formatSolve(solve)}
                                </td>
                                <td className="py-2">{index > 3 ? (ao5 === 'DNF'? 'DNF' : formatTime(ao5)): '-'}</td>
                                <td className="py-2">{index > 10 ? (ao12 === 'DNF'? 'DNF' : formatTime(ao12)): '-'}</td>
                            </tr>
                        )
                    }).reverse()}
                </tbody>
            </table>
        </div>
    )
}

export default SessionTable