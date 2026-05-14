// const express = require('express');
// const app = express();

// let data = 'Initial Data';

// const waitingClients = [];

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// app.get('/getData', (req, res) => {
//   if (data !== req.query.lastData) {
//     res.json({ data });
//   } else {
//     waitingClients.push(res);
//   }
// });

// // Use post/put to update
// app.get('/updateData', (req, res) => {
//   data = req.query.data;

//   while(waitingClients.length > 0) {
//     const client = waitingClients.pop();
//     client.json({ data });
//   }

//   res.send({ success: 'Data updated successfully'})
// })

// const port = process.env.PORT || 5011;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


//          code to handle timeout added 
// index.js

const express = require('express');

const app = express();

let data = 'Initial Data';

// Stores waiting clients
const waitingClients = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/getData', (req, res) => {

  // If new data exists immediately send it
  if (data !== req.query.lastData) {
    return res.json({ data });
  }

  // Timeout after 30 seconds
  const timeout = setTimeout(() => {

    // Remove client from waiting array
    const index = waitingClients.findIndex(
      client => client.res === res
    );

    if (index !== -1) {
      waitingClients.splice(index, 1);
    }

    // Send empty response
    res.json({ data: null });

  }, 30000);

  // Store client + timeout
  waitingClients.push({ res, timeout });

  // Handle browser/tab close
  req.on('close', () => {

    const index = waitingClients.findIndex(
      client => client.res === res
    );

    if (index !== -1) {

      clearTimeout(waitingClients[index].timeout);

      waitingClients.splice(index, 1);
    }
  });
});

app.get('/updateData', (req, res) => {

  data = req.query.data;

  // Notify all waiting clients
  while (waitingClients.length > 0) {

    const client = waitingClients.pop();

    clearTimeout(client.timeout);

    client.res.json({ data });
  }

  res.send({ success: 'Data updated successfully' });
});

const port = process.env.PORT || 5011;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});