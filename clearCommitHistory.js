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
    per_page: 5, // количество выгружаемых репозиториев (100 максимум)
    page: 2, // пагинация
  },
).then(async ({ data }) => {
  const dir = './downloadRepos';

  // проверка наличия папки для выгрузки репозиториев
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  data.forEach((repo) => {
    // если репозиторий не зугржуен в папку downloadRepos
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
      console.log(`Start git commands for: ${repo.name}`);

      // выполнение команд `git ...`
      exec(`cd ${dir}/${repo.name} && git checkout --orphan latest_branch`, (error, stdout, stderr) => {
        console.log('Step: 1');

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

      exec(`cd ${dir}/${repo.name} && git add -A`, (error, stdout, stderr) => {
        console.log('Step: 2');

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

      exec(`cd ${dir}/${repo.name} && git commit -am "version 1.0"`, (error, stdout, stderr) => {
        console.log('Step: 3');

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

      exec(`cd ${dir}/${repo.name} && git branch -D main`, (error, stdout, stderr) => {
        console.log('Step: 4');

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

      exec(`cd ${dir}/${repo.name} && git branch -D master`, (error, stdout, stderr) => {
        console.log('Step: 5');

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

      exec(`cd ${dir}/${repo.name} && git branch -m main`, (error, stdout, stderr) => {
        console.log('Step: 6');

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
    }
  });
});
