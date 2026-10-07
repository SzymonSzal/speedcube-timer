import { useEffect, useState, useRef} from "react"
import scrambleGenerator from "./scrambleGenerator"
import SessionTable from "./SessionTable"
import formatTime from "./formatTime"
//import formatSolve from "./formatSolve"
import EditSolveModal from "./EditSolveModal"


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
                    const newSolveId = Date.now()
                    
                    setIsActive(false)
                    setignoreNextRelease(true)
                    setScramble(scrambleGenerator())
                    setScoreTable(prevTable => [...prevTable, {
                        id: newSolveId,
                        time: finalTimeRef.current,
                        scramble: scramble,
                        penalty: 'none'
                    }]) 
                    fetch("http://127.0.0.1:8000/api/solves", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            id: newSolveId,
                            time: finalTimeRef.current,
                            scramble: scramble,
                            penalty: 'none'
                            
                        })
                    })
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
                <EditSolveModal
                onClose = {() => setSelectedSolve(null)}
                setScoreTable = {setScoreTable}
                selectedSolve = {selectedSolve}
                />
            )}
        </div>
    )
}

export default Timer