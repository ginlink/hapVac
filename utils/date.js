
import dayjs from 'dayjs'

export function calcTime(startTime) {

  const baseTime = dayjs(startTime)

  const checkTime = baseTime.subtract(getRandom(10, 30), 'minute').add(getRandom(0, 60), 'second')
  const applyTime = baseTime.subtract(getRandom(30, 60), 'minute').add(getRandom(0, 60), 'second')

  return {
    checkTime: checkTime.format('YYYY-MM-DD HH:mm:ss', 'startTime'),
    applyTime: applyTime.format('YYYY-MM-DD HH:mm:ss', 'startTime'),
  }
}

export function getRandom(start, end) {
  return Math.floor(Math.random() * (end - 10) + start)
}