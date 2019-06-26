const express = require("express");

const server = express();

let requestCount = 0;
let projects = [];

function checkProjectID(req, res, next) {
  const { id } = req.params;

  // verifica se recurso existe
  if (!projects.find(project => project.id == id)) {
    return res.status(400).json({ error: "Project not found" });
  }

  return next();
}

server.use(express.json());

server.use((req, res, next) => {
  console.log(`Request count: ${++requestCount}`);
  next();
});

server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;

  // verifica campos obrigatorios
  if (!id || !title) {
    return res.status(400).json({ error: "ID and title are required" });
  }

  // verifica duplicidades
  if (projects.find(project => project.id == id)) {
    return res.status(400).json({ error: "Project ID already exists" });
  }

  projects.push({
    id,
    title,
    tasks: tasks || []
  });

  return res.status(200).json();
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectID, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // verifica campos obrigatorios
  if (!title) {
    return res.status(400).json({ error: "Title are required" });
  }

  projects = projects.map(project =>
    project.id == id ? { ...project, title } : project
  );

  return res.status(200).json();
});

server.delete("/projects/:id", checkProjectID, (req, res) => {
  const { id } = req.params;

  projects = projects.filter(project => project.id != id);

  return res.status(200).json();
});

server.post("/projects/:id/tasks", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // verifica campos obrigatorios
  if (!title) {
    return res.status(400).json({ error: "Title are required" });
  }

  projects = projects.map(project => {
    if (project.id == id) project.tasks.push(title);
    return project;
  });

  return res.status(200).json();
});

server.listen(3000);
