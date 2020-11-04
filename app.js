require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const app = express();
const { getPhrase } = require("./services");
app.use(express.json({ extended: false }));

const { BOT_INFO, CHAT_ID } = process.env;

let db = new sqlite3.Database("./db/phrases.db", err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the phrases database.");
});

app.get("/", (req, res) => res.send("hello there!"));

/**
 * return { chinese, pinyin, english, name }
 */
app.get("/get_it/:phraseType", async (req, res) => {
  const { phraseType } = req.params;
  try {
    let obj = await getPhrase(phraseType);

    // if (obj && obj.chinese.length > 25) {
    //   obj = await getPhrase("proverb");
    // }

    const { chinese, pinyin, english, name } = obj;
    // const phrase = `📚 ${chinese}\n💬 <i>${pinyin}</i>\n♻️ ${english} \n[ <b>${name}</b> ]`;

    // await axios.get(
    //   `https://api.telegram.org/${BOT_INFO}/sendMessage?text=${encodeURI(
    //     phrase
    //   )}&chat_id=${CHAT_ID}&parse_mode=HTML`
    // );

    // insert one row into the langs table
    db.run(
      `INSERT INTO phrases( chinese, pinyin, english, origin ) VALUES(?,?,?,?)`,
      [chinese, pinyin, english, name],
      function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      }
    );

    // close the database connection
    // db.close();

    res.json(obj);
  } catch (error) {
    console.log(error);
    res.json({ err: "Oops, something went wrong!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is up and running on port ${PORT}`));
