import { getVisitorId } from '@/tool'
import { statEvents } from '@/api/stat'

class StatManager {
  constructor() {
    this.eventList = []
    this.timer = 0
  }

  statEvent(event) {
    this.eventList.push({
      ...event,
      visitorId: getVisitorId(),
    })
    if (this.timer) return
    this.timer = setTimeout(() => {
      this.sendEvents()
    }, 3000)
  }

  sendEvents() {
    this.timer = 0
    statEvents(this.eventList)
    this.eventList = []
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