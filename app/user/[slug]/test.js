const fetchAndSaveUserBattleData = require('./fetchUserBattles.js'); // path to your script

const nickname = 'Jamlons'; // Example nickname

fetchAndSaveUserBattleData(nickname)
  .then(response => console.log(response))
  .catch(error => console.error(error));