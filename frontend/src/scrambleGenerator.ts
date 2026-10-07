import {getRandomInt} from "./utils"

const possibleMoves = [['R', 'L'],['U', 'D'],['F', 'B']]
const modifiers = ['', "'", '2']
const scrambleLength = 20

export default function scrambleGenerator() {
    let prevMove = ''
    let prevAxis = -1
    let prevPrevAxis = -1
    let scramble = ''

    for (let i = 0; i<scrambleLength; i++) {
        let isValidMove = false
        let move = ''
        
        while (!isValidMove) {
            const axis = getRandomInt(3)
            move = possibleMoves[axis][getRandomInt(2)]

            const prevAxisSimilarity = (prevAxis === prevPrevAxis && axis === prevAxis)
            if (prevMove != move && !prevAxisSimilarity){
                prevPrevAxis = prevAxis
                prevAxis = axis
                prevMove = move
                isValidMove = true
            }

        }

        scramble += `${move + modifiers[getRandomInt(3)]} `
    }

    return scramble
}
