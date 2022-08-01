import {Db, MongoClient} from "mongodb";

export const dbHost = process.env.DB_HOST || "www.example.com";
export const dbUser = process.env.DB_USER || "root";
export const dbPass = process.env.DB_PASS || "";
export const dbName = process.env.DB_NAME || "site";

const connectString = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

let client: MongoClient = null;
let database;

if (process.env.NODE_ENV === "development") {
    if (!global._database) {
        client = new MongoClient(connectString);
        global._database = client.connect();
    }
    database = global._database;
} else {
    client = new MongoClient(connectString);
    database = client.connect();
}

export default database;
