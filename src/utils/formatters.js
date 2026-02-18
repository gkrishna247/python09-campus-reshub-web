import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

const IST = 'Asia/Kolkata'

export function formatDate(dateString) {
  return dayjs.utc(dateString).tz(IST).format('MMM DD, YYYY')
}

export function formatTime(timeString) {
  return dayjs(`2000-01-01T${timeString.length === 5 ? `${timeString}:00` : timeString}`).format(
    'hh:mm A',
  )
}

export function formatDateTime(dateTimeString) {
  return dayjs.utc(dateTimeString).tz(IST).format('MMM DD, YYYY hh:mm A')
}

export function formatRelativeTime(dateTimeString) {
  return dayjs.utc(dateTimeString).fromNow()
}
