/**
 * 把 DatePicker + TimePicker 的值組合成 LocalDateTime 格式字串
 * @param {string[]} dateRange - ["YYYY-MM-DD", "YYYY-MM-DD"]
 * @param {string[]} timeRange - ["HH:mm:ss", "HH:mm:ss"]
 * @returns {{ start: string, end: string }}
 */
export function formatDateTimeRange(dateRange, timeRange) {
  if (!dateRange || !timeRange || dateRange.length < 2 || timeRange.length < 2) {
    return { start: null, end: null }
  }

  const start = `${dateRange[0]}T${timeRange[0]}`
  const end = `${dateRange[1]}T${timeRange[1]}`
  return { start, end }
}
