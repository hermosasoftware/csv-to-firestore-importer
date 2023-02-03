import * as fs from "fs-extra";
import * as csv from "csvtojson";
import { program } from "commander";

program
  .version("0.0.1")
  .requiredOption("-s, --src <path>", "Source file path")
  .requiredOption("-c, --collection <path>", "Collection path in database")
  .option("-i, --id [id]", "Optional field to use for document ID")
  .parse(process.argv);

export const migrate = async (db) => {
  try {
    const options = program.opts();
    const colPath = options.collection;
    const file = options.src;

    const colRef = db.collection(colPath);
    let data;

    if (!colPath || !file) return Promise.reject("Missing require data");

    if (file.includes(".json")) {
      data = await fs.readJSON(file);
    } else if (file.includes(".csv")) {
      data = await readCSV(file);
    } else {
      return Promise.reject("Unnsuported file or bad file");
    }

    for (const item of data) {
      const id = options.id ? item[options.id].toStringI() : colRef.doc().id;
      const docRef = colRef.doc(id);
      docRef.set(item);
    }
    console.log("Firestore updated. Migration was a success!");
  } catch (error) {
    console.log("Migration failed!", error);
  }
};

async function readCSV(path): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      csv()
        .fromFile(path)
        .then((data) => {
          resolve(data);
        });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { migrate };
