const express = require('express');
const app = express();
const { getPhrase } = require('./services');
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('hello there!'));

app.get('/get_it', async (req, res) => {
  //length 25
  try {
    const obj = await getPhrase('sentence');
    res.json(obj);
  } catch (error) {
    console.log(error);
    res.json({ err: 'Oops, something went wrong!' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is up and running on port ${PORT}`));
