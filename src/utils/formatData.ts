export function formatData(deadline: string, estimated_hours?: string){

    let formattedDeadline = '-'
    let formattedEstimate = ''

    if(deadline){
        let deadlineObject = new Date(deadline)
        let day = deadlineObject.getDate()
        let month = deadlineObject.getMonth() + 1
        let fullYear = deadlineObject.getFullYear()
        formattedDeadline = `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${fullYear}`
    }

    if(estimated_hours){
        let estimatedHours = estimated_hours ? estimated_hours.toString().split(':') : ''
        formattedEstimate = estimatedHours ? `${estimatedHours[0]}h ${estimatedHours[1]}m` : ''
    }

    return { formattedEstimate, formattedDeadline }
}