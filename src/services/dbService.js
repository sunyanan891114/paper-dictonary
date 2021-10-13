import Dexie from "dexie";

class DBService {
  db;

  savePaper(pdfs) {
    this.getDBInstance();
    return this.db.papers.bulkAdd(pdfs);
  }

  async getAllPaper() {
    return this.db.papers.offset(0).toArray();
  }

  async filterPaper(search) {
    return this.db.papers
      .filter((paper) => {
        return paper.title.toLowerCase().indexOf(search.toLowerCase()) > -1;
      })
      .toArray();
  }

  async updatePaper(paper) {
    return this.db.papers.put(paper);
  }

  getDBInstance() {
    if (!this.db) {
      this.db = new Dexie();
      this.db.version(1).stores({ papers: "path, title" });
    }
  }
}

export const dbService = new DBService();
dbService.getDBInstance();
