import axios from 'axios'
import * as cheerio from 'cheerio'

import { NationalDay } from '../types'
import { unabbrNum } from '../utils/removeKDigits'

export async function getData() {
  return axios
    .get('https://nationaltoday.com/what-is-today/')
    .then(function ({ data }) {
      const $ = cheerio.load(data)
      const nationalToday: NationalDay[] = []

      $('div.day-card').each((_idx, el) => {
        let image = $(el).find('.day-card-mask').attr('style')
        let popularity = $(el).find('.trending-share-count').text()

        if (image && popularity) {
          image = image.slice(22, image.length - 2)
          popularity = popularity.slice(0, popularity.length - 7)
          let popularityNum: number = parseInt(popularity)
          if (popularity.includes('K')) {
            popularityNum = unabbrNum(popularity)
          }

          const today: NationalDay = {
            title: $(el).find('.holiday-title').text(),
            description: $(el).find('.excerpt').text(),
            popularity: popularityNum,
            imageUrl: image,
            url: $(el).find('.holiday-title').parent().attr('href') as string,
          }

          nationalToday.push(today)
        }
      })

      return nationalToday
    })
    .catch(function (error) {
      console.error(error)
      return undefined
    })
}
