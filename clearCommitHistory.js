// Выгрузить все репозитории
// У каждого репозитория очистить историю коммитов
// Запушить изменения со комментарием "version 1.0"

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
    page: 1, // пагинация
  },
).then(async ({ data }) => {
  const dir = './downloadRepos';

  // проверка наличия папки для выгрузки репозиториев
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // массив элементов которых НЕ должно быть в отфильтрованном массиве
  const ignoreRepos = ['teacher-map'];

  const dataIgnoreArray = new Set(ignoreRepos);

  // отфильтрованный массив
  const filteredArray = data.filter((element) => !dataIgnoreArray.has(element.name));

  // перебор отфильтрованного массива
  filteredArray.forEach((repo) => {
    // если репозиторий не загружен в папку downloadRepos
    if (!fs.existsSync(path.join(dir, repo.name))) {
      console.log(`Start clone repository: ${repo.name}`);

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
        `cd ${dir}/${repo.name} && git checkout --orphan latest_branch`,
        `cd ${dir}/${repo.name} && git add -A`,
        `cd ${dir}/${repo.name} && git commit -am "version 1.0"`,
        `cd ${dir}/${repo.name} && git branch -D main`,
        `cd ${dir}/${repo.name} && git branch -D master`,
        `cd ${dir}/${repo.name} && git branch -m main`,
        // `cd ${dir}/${repo.name} && git push --force-with-lease origin main`,
      ];

      console.log(`Start git commands for: ${repo.name}`);

      // перебор git команд
      arrCommands.forEach((command, index) => {
        exec(command, (error, stdout, stderr) => {
          console.log(`Step: ${index + 1}`);

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
