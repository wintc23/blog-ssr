import { getVisitorId } from '@/tool'
import { statEvents } from '@/api/stat'

class StatManager {
  constructor() {
    this.eventList = []
    this.timer = 0
  }

  statEvent(event) {
    const payload = {
      ...event,
      visitorId: getVisitorId(),
    }
    if (event.name === 'visitPage') {
      return statEvents([payload])
    }
    this.eventList.push(payload)
    if (this.timer) return
    this.timer = setTimeout(() => {
      this.sendEvents()
    }, 3000)
  }

  sendEvents() {
    if (!this.eventList.length) {
      this.timer = 0
      return
    }
    const eventList = this.eventList.slice()
    this.timer = 0
    this.eventList = []
    statEvents(eventList)
  }
}

const instance = new StatManager()
export function statEvent(name, params) {
  if (process.server) return
  const event = {
    name,
    params: JSON.stringify(params),
  }
  instance.statEvent(event)
}
