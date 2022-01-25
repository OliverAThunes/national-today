import { WebClient, LogLevel, Block } from '@slack/web-api'
import dotenv from 'dotenv'
import { NationalDay } from './types'

import { getData } from './getData'

dotenv.config()

const token = process.env.TOKEN

let logLevel = LogLevel.ERROR

const MORNING = '09:00'
const CHANNEL_ID = 'C01GVRGFF8Q' // dev-team
//const CHANNEL_ID = 'U01G1KRQXUG' // Me

const randomText = [
  'National day galore! :calendar:',
  'Huzza! :tada:',
  'National day squadala! :tada:',
  'Another day, another thirty national days :calendar:',
  'Another day, another fifty national days :calendar:',
  'Try not to miss bagel day this year. :bagel:',
  'Please send any complaints that you might have to miles@netron.no :email:',
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

    if (`${hours}:${minutes}` == MORNING) {
      clearInterval(interval)

      // Get data
      const data = (await getData()) as NationalDay[]

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
          }
        )

        today.forEach(
          ({ title, description, popularity, imageUrl, url }: NationalDay) => {
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
