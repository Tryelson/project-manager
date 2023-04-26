export default function secondsToTime(seconds: number){
    let timer = {
        hours: 0,
        minutes: 0,
        seconds: 0
    }

    if(seconds >= 3600){
        let horas = Math.floor(seconds / 3600)
        let minutes = Math.floor((seconds - (horas * 3600)) / 60)
        let segundos = seconds - (horas * 3600) - (minutes * 60)

        timer = {
            ...timer,
            hours: horas,
            minutes,
            seconds: segundos
        }

    } else if(seconds < 3600 && seconds > 60) {
        let minutes = Math.floor(seconds / 60)
        let segundos = seconds - (minutes * 60)

        timer = {
            ...timer,
            minutes: minutes,
            seconds: segundos
        }
    } else {
        timer = {
            ...timer,
            seconds
        }
    }

    let timerFormat = `${timer.hours}h
    ${timer.minutes > 9 ? `${timer.minutes}min` : `0${timer.minutes}min`}
    ${timer.seconds > 9 ? `${timer.seconds}s` : `0${timer.seconds}s`}`

    return {timerFormat, timer}
}