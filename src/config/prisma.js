import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg(
  new Pool({
    connectionString,
  })
);

const prisma = new PrismaClient({ adapter });

export default prisma;
