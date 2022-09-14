// Выгрузить все репозитории
// У каждого репозитория очистить историю коммитов
// Запушить изменения со комментарием "Clearing old commits"

require('dotenv').config();
const fs = require('fs/promises');
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
    per_page: 3, // количество выгружаемых репозиториев (100 максимум)
    page: 1, // пагинация
  },
).then(({ data }) => {
  console.log(data);

  const folder = fs.stat('./downloadRepos');

  console.log(folder);
});
