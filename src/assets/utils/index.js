import { openApp } from './openapp.js'
import ua from './ua.js'
import queryParams from './queryParams.js'
import { sendTeaEnterEvent, sendTeaStayEvent, sendTeaCommEvent } from './tea_utils'
export default {
  openApp,
  queryParams,
  ua,
  sendTeaEnterEvent,
  sendTeaStayEvent,
  sendTeaCommEvent
}
