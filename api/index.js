import express from 'express';
// import fs from 'fs';
import cors from 'cors';
import items from './routes/items.js'

    // Estas funciones solo son para usar base da datos en archivo
    // const readData = () => {
    //     try{
    //         const data = fs.readFileSync("./db.json");
    //         // console.log("data: ", JSON.parse(data));
    //         return JSON.parse(data);
    //     } catch(error){
    //         console.log(error);
    //     }
    // }

    // const writeData = (data) => {
    //     try{
    //         fs.writeFileSync("./db.json", JSON.stringify(data));
    //     } catch(error){
    //         console.log(error);
    //     }
    // }
    /////////////////////////////////////////////////////////////////

const app = express();
app.use(cors());
app.use(express.json());
app.use("/items", items);

app.listen(2000, () => {
    console.log("Server listening on port 2000")
})

// app.get("/", (req, res) => {
//     const data = readData();
//     res.json(data.items);
//     console.log("allItems Fetch");
// })

// app.get("/getItemById/:id", (req, res) => {
//     const data = readData();
//     const id = req.params.id;
//     const item = data.items.find(elem => elem.id === id);
//     res.json(item);
//     console.log("getItemById Fetch");
// })