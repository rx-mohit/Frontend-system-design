import express from "express";

const app = express();

app.all("/", (req, res) => {
  // console.log(`request >` , req);
  // console.log(`response >` , res);
  res.send(`I'M UP!`);
});

const todos = [
  {
    id: "1",
    title: "Task 1",
    completed: false,
  },
  {
    id: "2",
    title: "Task 2",
    completed: true,
  },
];

//Create
app.post('/todos', (res, req) => {
    let newTodos = res.body();
    todos.push(newTodos);
    res.json({
        message: "New Todo Added"
    })
});

//Read
app.get('/todos', (res, req) => {
    res.json(todos);
});

//Update


//Delete


let PORT = 5111;
app.listen(PORT, () => {
  console.log(`i am running on ${PORT}`);
});
