import * as fs from 'fs';

const dataPath = 'src/data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const difficulties = ['Easy', 'Medium', 'Hard', 'Extreme'];

data.projects = data.projects.map((p, i) => ({
  ...p,
  difficulty: difficulties[i % 4]
}));

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Updated projects with difficulty tags');
