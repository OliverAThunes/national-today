import { WebClient } from '@slack/web-api'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.TOKEN

const web = new WebClient(token)

