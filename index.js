const express = require("express");
const server = express();

let projects = [];
let requestCount = 0;

function checkProjectID(req, res, next) {
  if (!projects.find(project => project.id === req.params.id)) {
    return res.status(400).json({ erro: "Project not found" });
  }

  return next();
}

server.use((req, res, next) => {
  console.log(++requestCount);
  next();
});

server.post("/projects", (req, res) => {});
server.get("/projects", (req, res) => {});
server.put("/projects/:id", checkProjectID, (req, res) => {});
server.delete("/projects/:id", checkProjectID, (req, res) => {});

server.post("/projects/:id/tasks", (req, res) => {});

server.listen(3000);
