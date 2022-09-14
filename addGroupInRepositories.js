require('dotenv').config();
const { Octokit } = require('@octokit/core');

const octokit = new Octokit({
  auth: process.env.TOKEN, // персональный токен
});

// добавление группы пользователей в репозитории организации
octokit.request(
  'GET /orgs/Elbrus-Bootcamp/repos',
  {
    org: 'Elbrus-Bootcamp',
    type: 'all', // тип выгружаемых репозиториев
    per_page: 100, // количество выгружаемых репозиториев (100 максимум)
    page: 5, // пагинация
  },
)
  .then((data) => {
    data.data.forEach((repo) => {
      octokit.request(
        `PUT /orgs/Elbrus-Bootcamp/teams/elbrus-team/repos/Elbrus-Bootcamp/${repo.name}`,
        {
          org: 'Elbrus-Bootcamp', // имя организации
          team_slug: 'elbrus-team', // команда в организации
          owner: 'Elbrus-Bootcamp', // владелец репозитория
          repo: `${repo.name}`, // имя репозитория
          permission: 'admin', // вид прав
        },
      )
        .then((logData) => console.log(logData));
    });
  });
