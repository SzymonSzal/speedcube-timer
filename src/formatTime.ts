export default function formatTime(result: number) {
    const roundedResult = Math.round(result)
    if (roundedResult>=60000) {
        const minutes = Math.floor(roundedResult/60000)
        const seconds = ((roundedResult % 60000)/1000).toFixed(2).padStart(5, '0')
        return `${minutes}:${seconds}`
    }
    return (roundedResult/1000).toFixed(2)
    
}