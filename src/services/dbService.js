import Dexie from "dexie";

class DBService {
  db;

  savePdf(pdfs) {
    this.getDBInstance();
    return this.db.files.bulkAdd(pdfs);
  }

  async getAllPdf() {
    return this.db.files.offset(0).toArray();
  }

  getDBInstance() {
    if (!this.db) {
      this.db = new Dexie();
      this.db.version(1).stores({ files: "path" });
    }
  }
}

export const dbService = new DBService();
dbService.getDBInstance();
