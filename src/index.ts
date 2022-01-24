import { WebClient, LogLevel } from '@slack/web-api'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.TOKEN

let logLevel = LogLevel.ERROR

const MORNING = '16:00'
const USER_ID = 'U01G2UJNLRH'

async function init(): Promise<void> {
  if (process.env.NODE_ENV == 'development') {
    logLevel = LogLevel.DEBUG
  }

  console.log('Starting...')

  const web = new WebClient(token, {
    logLevel: logLevel,
  })

  const interval = setInterval(async () => {
    const time = new Date().toLocaleTimeString().split(' ')[0]
    const hours = time.split(':')[0]
    const minutes = time.split(':')[1]

    //if (`${hours}:${minutes}` == MORNING) {
    clearInterval(interval)
    console.log('Sending message')

    const openChannel = await web.conversations.open({
      users: USER_ID,
    })

    const channelId = openChannel?.channel?.id

    if (channelId !== undefined) {
      web.chat.postMessage({
        text: `Hey knucklehead.`,
        channel: channelId,
        as_user: true,
      })
    }
    //}
  }, 1000)
}

init()
