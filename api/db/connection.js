import { MongoClient, ServerApiVersion } from 'mongodb';
import fs from 'fs';

const readKey = () => {
        try{
            const data = fs.readFileSync("./db/key.json");
            // console.log("dbKey: ", JSON.parse(data).key);
            return JSON.parse(data);
        } catch(error){
            console.log(error);
        }
    }

const dbKey = readKey();

const uri = `mongodb+srv://${dbKey.name}:${dbKey.pass}@cluster0.hmv6lkf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectToMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Conectado a MongoDB Atlas");
    db = client.db("ArteYSolucionesDB"); // 👈 ahora sí, después de conectar
    // console.log("db: ", db);
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err);
  }
}

    // Sirve para chequear q existe la base de datos llamada ArteYSoluciones
        // const adminDb = client.db().admin(); // Accede al "admin" virtual

        // const dbs = await adminDb.listDatabases();
        // const exists = dbs.databases.some(db => db.name === "ArteYSoluciones");

        // if (exists) {
        //   console.log("✅ La base de datos 'ArteYSoluciones' existe.");
        // } else {
        //   console.warn("⚠️ La base de datos 'ArteYSoluciones' NO existe (aún).");
        // }

await connectToMongo(); // 👈 asegurate de ejecutar esto antes de usar `db`


export default db;