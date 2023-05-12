import { Sequelize } from "sequelize";

const uri: string = process.env.DATABASE_URL ||
  'postgres://gwipceoi:NI8RPw9xfzCxfsI2vNGokRXq-neTAltn@tuffi.db.elephantsql.com/gwipceoi';

export const sequelize = new Sequelize(uri, { dialect: "postgres" });
