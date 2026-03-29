import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'

dotenv.config({ path: '.env.local' })

const connectionString = process.env.DATABASE_URL!

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: connectionString,
  },
  migrate: {
    adapter: () => new PrismaPg({ connectionString }),
  },
})
