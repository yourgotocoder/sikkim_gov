import Dexie from "dexie";

const database = new Dexie("database");
database.version(1).stores({
  districts: "++id, name",
});
database.version(2).stores({
  subjects: "++id, title, code",
});

export const districtsTable = database.table("districts");
export const subjectsTable = database.table("subjects");

export default database;
