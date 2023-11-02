import Dexie from "dexie";

const database = new Dexie("database");
database.version(1).stores({
  districts: "++id, name",
});
database.version(2).stores({
  subjects: "++id, title, code",
});
database.version(3).stores({
  schools: "++id, name, code, district, contactno, *subjects",
});

export const districtsTable = database.table("districts");
export const subjectsTable = database.table("subjects");
export const schoolsTable = database.table("schools");

export default database;
