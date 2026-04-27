import express from 'express';

const app = express();

app.all('/', (req, res) => {
    console.log(`request >` , req);
    console.log(`response >` , res);
    res.send(`I'M UP!`);
})

let PORT = 5111;
app.listen(PORT, () => {
  console.log(`i am running on ${PORT}`);
});
