# Sentence Mixer Bot

### Stack

- **Logic**: TypeScript, Nodejs, Telegraf framework
- **Database**: Firebase Realtime Database
- **Host**: AWS Lambda, Serverless framework

### Set up

#### Database

1. Set up Firebase project and Firebase Realtime Database
1. Create admin credentials and store into config folder

#### Telegram Bot

1. Create bot with `@Botfather`
1. Create `.env.development`,`.env.production` files

- store bot token and firebase realtime db url (see `.env.template`)

#### Install dependencies

1. `yarn`

#### Hosting

1. Set up AWS CLI
1. Download Serverless framework with npm
1. Run `yarn dev` to run locally, `yarn deploy` to deploy
