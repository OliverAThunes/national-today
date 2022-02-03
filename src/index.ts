import { WebClient, LogLevel, Block } from '@slack/web-api'
import dotenv from 'dotenv'
import { NationalDay } from './types'

import { getData } from './getData'

dotenv.config()

const token = process.env.TOKEN

let logLevel = LogLevel.ERROR

const MORNING = '08:30'
const CHANNEL_ID = 'C01GVRGFF8Q' // dev-team
//const CHANNEL_ID = 'U01G1KRQXUG' // Me

const randomText = [
  'National day galore! :calendar:',
  'Huzzah! :tada:',
  'National day squadala! :tada:',
  'Another day, another thirty national days :calendar:',
  'Another day, another fifty national days :calendar:',
  'Try not to miss bagel day this year. :bagel:',
  'Please send any complaints that you might have to miles@netron.no :email:',
  "If you're reading this, react to this post with :cool:",
]

async function init(): Promise<void> {
  if (process.env.NODE_ENV == 'development') {
    logLevel = LogLevel.DEBUG
  }

  const web = new WebClient(token, {
    logLevel: logLevel,
  })

  const interval = setInterval(async () => {
    const time = new Date().toLocaleTimeString().split(' ')[0]
    const hours = time.split(':')[0]
    const minutes = time.split(':')[1]

    // Get data
    const data = (await getData()) as NationalDay[]
    // Sort by popularity
    data.sort((a: NationalDay, b: NationalDay) => {
      return b.popularity - a.popularity
    })

    if (`${hours}:${minutes}` == MORNING) {
      clearInterval(interval)

      let buildMessage = (today: NationalDay[]) => {
        let blocks = []

        const flavourText =
          new Date().getDay() == 5
            ? '*_Log your hours in Power Office!_*'
            : randomText[Math.floor(Math.random() * randomText.length)]

        blocks.push(
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: ':sunrise: Good morning Netron Dev! National today',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: flavourText,
            },
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: "Here's today's most popular national day.",
            },
          }
        )

        let { title, description, popularity, imageUrl, url }: NationalDay =
          today[0]

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*<${url}|${title}>*\n${description}`,
          },
          accessory: {
            type: 'image',
            image_url: imageUrl,
            alt_text: 'image',
          },
        })

        blocks.push(
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Wanna see more? <https://nationaltoday.com/what-is-today/|Click here.>',
            },
          }
        )

        return blocks
      }

      let blocks = buildMessage(data)

      web.chat.postMessage({
        channel: CHANNEL_ID,
        blocks: blocks,
        as_user: true,
        unfurl_links: false,
        unfurl_meida: false,
      })
    }
  }, 1000)
}

init()
