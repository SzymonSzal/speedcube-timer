import type { Solve } from "./Timer";
import formatSolve from "./formatSolve";
import React from "react";

type EditSolveModalProps = {
    onClose: () => void
    selectedSolve: Solve
    setScoreTable: React.Dispatch<React.SetStateAction<Solve[]>>

}

export default function EditSolveModal({onClose, selectedSolve, setScoreTable}: EditSolveModalProps) {
    const penaltyOptions: ('none' | '+2' | 'DNF')[] = ['none', '+2', 'DNF'];

    const handlePenalty = async (penaltyType: 'none' | '+2' | 'DNF') => {
        setScoreTable(prevTable => prevTable.map(solve => {
            if (selectedSolve.id === solve.id) {
                return { ...solve, penalty: penaltyType };
            }
            return solve;
        }));
        onClose();

        try {
            await fetch(`http://127.0.0.1:8000/api/solves/${selectedSolve.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    penalty: penaltyType
                })

            })
        } catch(error) {
            console.log("Server not responding: ", error)
        }
    }

    return (
        <div 
            onClick={()=> onClose()} 
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
                    {penaltyOptions.map(option => {
                        return(
                            <button
                                key={option}
                                className="rounded-lg h-9 w-11 hover:bg-zinc-600"
                                onClick={() => handlePenalty(option)}
                            >
                                {option === "none"? "OK" : option}
                            </button>
                        )
                    })}
                    <button 
                        className="rounded-lg h-9 w-9 bg-zinc-700 hover:bg-gray-500"
                        onClick={async ()=> {
                            setScoreTable(prevTable => prevTable.filter(solve => solve.id !== selectedSolve.id))
                            onClose()

                            try{
                                await fetch(`http://127.0.0.1:8000/api/solves/${selectedSolve.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                            } catch(error) {
                                console.log("Server not responding: ", error)
                            }
                        }}
                    >
                        X
                    </button>
                </div>
                <p className="text-sm text-center text-zinc-400 mt-4">{selectedSolve.scramble}</p>
            </div>
        </div>
    )
}