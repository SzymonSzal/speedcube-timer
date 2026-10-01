import { useEffect, useState, useRef} from "react"
import scrambleGenerator from "./scrambleGenerator"
import SessionTable from "./SessionTable"
import formatTime from "./formatTime"
import formatSolve from "./formatSolve"

export type Solve = {
    id: number
    time: number
    scramble: string
    penalty: 'none' | '+2' | 'DNF'
}

function Timer() {
    const [isActive, setIsActive] = useState(false)
    const [ignoreNextRelease, setignoreNextRelease] = useState(false)
    const [liveTime, setLiveTime] = useState(0)
    const [scramble, setScramble] = useState(scrambleGenerator())
    const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null)
    const [scoreTable, setScoreTable] = useState<Solve[]>(() => {
        const saved = localStorage.getItem('cubing_session')
        if(saved) return JSON.parse(saved)
        return []
    })

    const startRef = useRef(0)
    const liveTimeDisplayRef = useRef(0)
    const finalTimeRef = useRef(0)
    

    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            if (ignoreNextRelease && !isActive) {
                setignoreNextRelease(false)
            } else if (!isActive && e.code === 'Space') {
                startRef.current = Date.now()
                setIsActive(true)
            }
            
            
            
        }

        const handleKeyDown = () => {
                if (isActive){
                    clearInterval(liveTimeDisplayRef.current)
                    finalTimeRef.current = Date.now() - startRef.current
                    setLiveTime(finalTimeRef.current)
                    
                    setIsActive(false)
                    setignoreNextRelease(true)
                    setScramble(scrambleGenerator())
                    setScoreTable(prevTable => [...prevTable, {
                        id: Date.now(),
                        time: finalTimeRef.current,
                        scramble: scramble,
                        penalty: 'none'
                    }])
                }
        }
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        return () => {
            document.removeEventListener('keyup', handleKeyUp)
            document.removeEventListener('keydown', handleKeyDown)
        
        }
        
    }, [isActive, ignoreNextRelease]);

    useEffect(() => {
        if (isActive) {
            liveTimeDisplayRef.current = setInterval(() => {
                setLiveTime(Date.now() - startRef.current)
            }, 10);
        }
        return () => {
            clearInterval(liveTimeDisplayRef.current)
        }
    }, [isActive])

    useEffect(() => {
        localStorage.setItem('cubing_session', JSON.stringify(scoreTable))
    }, [scoreTable])


    return (
        <div className="h-screen overflow-hidden bg-zinc-900 text-zinc-100 flex flex-col md:flex-row">
            <div className="w-full md:w-80 lg:w-96 bg-zinc-800/50 p-6 flex flex-col gap-6 border-l border-zinc-800">
                <button 
                onClick={(e) => {
                        e.currentTarget.blur()
                        setScoreTable([])
                    }
                } 
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg shadow-indigo-500/20"
                >Reset the Table</button>
                <div className="flex-1 overflow-y-auto pr-2">
                    <SessionTable times={scoreTable} onTimeClick={setSelectedSolve}/>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative p-8">
                <div className="absolute top-8 text-center text-xl md:text-2xl font-medium tracking-wide max-w-4xl text-zinc-300">
                    <p className="m-4">{scramble}</p>
                </div>
                <div className="text-7xl md:text-9xl font-bold font-mono tracking-tight">
                    <p>{formatTime(liveTime)}</p>
                </div>
            </div>


            {selectedSolve && (
                <div 
                onClick={()=> setSelectedSolve(null)} 
                className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
                >
                    <div 
                    onClick={(e) => e.stopPropagation()}
                    className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl p-6 w-full max-w-sm"
                    >
                        <h2 className="flex justify-center text-xl">Edit solve</h2>
                        <div className="flex justify-center text-xl font-semibold mt-3">
                            {formatSolve(selectedSolve)}
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            <button 
                                className="rounded-lg h-9 w-11 hover:bg-zinc-600"
                                onClick={()=> {
                                    setScoreTable(prevTable => prevTable.map(solve => {
                                        if (selectedSolve.id === solve.id) {
                                        return {...solve, penalty: 'none'}
                                        }
                                        return solve
                                    }))
                                    setSelectedSolve(null)
                                }}
                            >OK</button>
                            <button
                                className="rounded-lg h-9 w-11 hover:bg-zinc-600"
                                onClick={()=> {
                                    setScoreTable(prevTable => prevTable.map(solve => {
                                        if (selectedSolve.id === solve.id) {
                                            return {...solve, penalty: '+2'}
                                        }
                                        return solve
                                    }))
                                    setSelectedSolve(null)
                                    }}
                            >+2</button>
                            <button
                                className="rounded-lg h-9 w-11 hover:bg-zinc-600"
                                onClick={()=> {
                                    setScoreTable(prevTable => prevTable.map(solve => {
                                        if (selectedSolve.id === solve.id) {
                                            return {...solve, penalty: 'DNF'}
                                        }
                                        return solve
                                    }))
                                    setSelectedSolve(null)
                                    }}
                            >dnf</button>
                            <button 
                            className="rounded-lg h-9 w-9 bg-zinc-700 hover:bg-gray-500"
                            onClick={()=> {
                                setScoreTable(prevTable => prevTable.filter(solve => solve.id !== selectedSolve.id))
                                setSelectedSolve(null)
                            }}
                            >X</button>
                        </div>
                        <p className="text-sm text-center text-zinc-400 mt-4">{selectedSolve.scramble}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Timer