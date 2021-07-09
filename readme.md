# Sentence Mixer Bot

Inspired by [Warcraft 3 Build a Sentence map](https://www.epicwar.com/maps/88906/), this bot mixes words and sentences given by you and your friends.

### Stack

- **Logic**: TypeScript, Nodejs, Telegraf framework
- **Database**: Firebase Realtime Database
- **Host**: AWS Lambda, Serverless framework

## Serverless Bot Set Up

#### Database

1. Set up Firebase project and Firebase Realtime Database
1. Create admin credentials and store into config folder

#### Telegram Bot

1. Create bot with `@Botfather` and get token

#### App Config

1. Create `.env.development`,`.env.production` files
2. Write bot token and firebase realtime db url (see `.env.template`)

#### Install dependencies

1. `yarn`

#### Hosting

1. Set up AWS CLI
1. Download Serverless framework with npm
1. Run `yarn dev` to run locally, `yarn deploy` to deploy
