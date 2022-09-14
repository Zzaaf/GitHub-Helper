// Выгрузить все репозитории
// У каждого репозитория очистить историю коммитов
// Запушить изменения со комментарием "Clearing old commits"

require('dotenv').config();
const fs = require('fs');
const { exec } = require('child_process');
const { Octokit } = require('@octokit/core');

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
    console.log(123);
    fs.mkdirSync(dir);
  }

  data.forEach((repo) => {
    console.log(repo.ssh_url);

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

    // выполнение команды `git log`
    exec(`cd ${dir}/${repo.name} && git log`, (error, stdout, stderr) => {
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
});
