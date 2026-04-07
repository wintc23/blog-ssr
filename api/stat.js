import axios from '@/api'

export function statEvents(events) {
  return axios.post(`/save-stat-events/`, { events })
}

export function getStatEventsInfo(params) {
  return axios.get('/get-stat-events-info/', { params })
}

export function getSiteStatSummary() {
  return axios.get('/get-site-stat-summary/')
}

export function getSiteStatReport(params) {
  return axios.get('/get-site-stat-report/', { params })
}
