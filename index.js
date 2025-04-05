import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});
db.connect();
dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//let items = [
//  { id: 1, title: "Buy milk" },
//  { id: 2, title: "Finish homework" },
//];
var items=[];
//async function check(){
//  let items=[];
//  var result=await db.query("SELECT * FROM items");
//  for(var i=0;i<result.rows.length;i++){
//    items.push(result.rows[i].title);
//  }
//  return items;
//}
app.get("/", async(req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    var items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/add", async(req, res) => {
  try{
  var item = req.body.newItem;
  //items.push({ title: item });
  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    res.redirect("/");
  }catch (err) {
    console.log(err);
  }
});

app.post("/edit", async(req, res) => {
  try{
  var EditId = req.body.updatedItemId;
  var EditTitle=req.body.updatedItemTitle;
  await db.query("UPDATE items SET title=$1 Where id=$2;",[EditTitle,EditId]);
  res.redirect("/");
  }catch (err) {
    console.log(err);
  }
});

app.post("/delete", async(req, res) => {
  try{
  var DeleteId=req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id=$1",[DeleteId]);
  res.redirect("/");
  }
  catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
