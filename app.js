require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const app = express();
const { getPhrase, getTranslation } = require("./services");
app.use(express.json({ extended: false }));

const { BOT_INFO, CHAT_ID } = process.env;

let db = new sqlite3.Database("./db/phrases.db", err => {
  if (err) return console.error(err.message);
  console.log("Connected to the phrases database.");
});

app.get("/", (req, res) => res.send("hello there!"));

/**
 * return { chinese, pinyin, english, name }
 */
app.get("/get_it/:phraseType", async (req, res) => {
  const { phraseType } = req.params;
  try {
    const { chinese, pinyin, english, name } = await getPhrase(phraseType);

    // insert one row into the langs table
    db.run(
      `INSERT INTO phrases( chinese, pinyin, english, origin, is_published ) VALUES(?,?,?,?,?)`,
      [chinese, pinyin, english, name, 0],
      function(err) {
        if (err) return console.log(err.message);
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );

    // close the database connection
    // db.close();
    return res.json(obj);
  } catch (error) {
    console.log(error);
    res.json({ err: "Oops, something went wrong!" });
  }
});

/**
 * @route     /get_row?id=...
 */
app.get("/get_row", async (req, res) => {
  const { id } = req.query;
  const sql = `SELECT * FROM phrases WHERE id = ?`;

  db.get(sql, [id], async (err, row) => {
    if (err) return console.error(err.message);

    const translation = await getTranslation(row.chinese);
    return res.json({ ...row, translation });
  });

  // close the database connection
  // db.close();
});

/**
 * @route   /add_russian?id=..&russian=...
 * @desc    add russian translation to a row in db
 */
app.get("/add_russian", async (req, res) => {
  const { id, russian } = req.query;

  const sql = `UPDATE phrases SET russian = ? WHERE id = ? AND russian IS NULL`;
  let data = [russian, id];

  db.run(sql, data, function(err) {
    if (err) return console.error(err.message);
    console.log(`Row(s) updated: ${this.changes}`);
    return res.json(this.changes);
  });
});

app.get("/add_pinyin", async (req, res) => {
  const { id, pinyin } = req.query;

  const sql = `UPDATE phrases SET pinyin = ? WHERE id = ?`;
  let data = [pinyin, id];

  db.run(sql, data, function(err) {
    if (err) return console.error(err.message);
    console.log(`Row(s) updated: ${this.changes}`);
    return res.json(this.changes);
  });
});

app.post("/post_it", async (req, res) => {
  const sql = `
                SELECT * FROM phrases WHERE is_published = 0 AND 
                russian IS NOT NULL ORDER BY RANDOM() LIMIT 1
              `;

  db.get(sql, [], async (err, row) => {
    if (err) return console.error(err.message);

    const { id, chinese, pinyin, russian, origin } = row;
    const phrase = `📚 <b>${chinese}</b>\n💬 <i>${pinyin}</i>\n♻️ ${russian} \n[ <b>${origin}</b> ]`;

    try {
      await axios.get(
        `https://api.telegram.org/${BOT_INFO}/sendMessage?text=${encodeURI(
          phrase
        )}&chat_id=${CHAT_ID}&parse_mode=HTML`
      );

      // return res.send("Success");
    } catch (err) {
      console.log(err);
      res.json({ err: "Oops, something went wrong!" });
    }

    const published_sql = `UPDATE phrases SET is_published = 1 WHERE id = ${id}`;
    // const data = [0, id];
    db.run(published_sql, [], function(err) {
      if (err) return console.error(err.message);
      console.log(`id ${id} changed`);
      return res.json(this.changes);
    });
  });

  // db.close();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is up and running on port ${PORT}`));
