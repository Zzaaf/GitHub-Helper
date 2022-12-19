// Выгрузить все репозитории
// У каждого репозитория проверить наличие дефолтной ветки 'main'
// На основе списка, в каждом репозитории переключится на 'master' и переименовать в 'archive'

require('dotenv').config();
const fs = require('fs');
const { exec } = require('child_process');
const { Octokit } = require('@octokit/core');
const path = require('path');

const octokit = new Octokit({
  auth: process.env.TOKEN, // персональный токен
});

// выгрузка всех репозиториев с учётом пагинации
octokit.request(
  'GET /orgs/Elbrus-Bootcamp/repos',
  {
    org: 'Elbrus-Bootcamp',
    type: 'all', // тип выгружаемых репозиториев
    per_page: 1, // количество выгружаемых репозиториев (100 максимум)
    page: 2, // пагинация
  },
).then(async ({ data }) => {
  const dir = './downloadRepos';

  // проверка наличия папки для выгрузки репозиториев
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // массив элементов которых НЕ должно быть в отфильтрованном массиве
  const ignoreRepos = ['teacher-map', 'org-pairs-splitter', 'skeleton-express-mongoose', 'try-html', 'Elbrus-Bootcamp', 'assessment-1b', 'org-scheduler-react', 'assessment-3a', 'denis-exam-2', 'eagles-online-classes-checkpoint', 'assessment-1a-containers', 'assessment-1c-donut'];

  const dataIgnoreArray = new Set(ignoreRepos);

  // отфильтрованный массив репозиториев с дефолтной веткой main
  const filteredArray = data
    .filter((repo) => !dataIgnoreArray.has(repo.name))
    .filter((repo) => repo.default_branch === 'main');

  console.log(filteredArray);

  // перебор отфильтрованного массива
  filteredArray.forEach((repo) => {
    // если репозиторий не загружен в папку downloadRepos
    if (!fs.existsSync(path.join(dir, repo.name))) {
      // выполнение команды `git clone`
      exec(`cd ${dir} && git clone ${repo.ssh_url}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    } else {
      const arrCommands = [
        // `cd ${dir}/${repo.name} && git branch master`,
        // `cd ${dir}/${repo.name} && git branch -m master archive`,
        // `cd ${dir}/${repo.name} && git push origin archive`,
        // `cd ${dir}/${repo.name} && git push -d origin master`,
      ];

      // перебор git команд
      arrCommands.forEach((command) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      });
    }
  });
});
