import "dotenv/config";
import { defineConfig } from "prisma/config";

const baseUrl = process.env["DIRECT_URL"] || "";
const url = baseUrl.includes("?")
  ? `${baseUrl}&schema=dhwar`
  : `${baseUrl}?schema=dhwar`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});
