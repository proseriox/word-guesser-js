$(document).ready(function () {
  let words = ["Apple", "Apricot", "Avocado", "Banana", "Bilberry", "Blackberry", "Blackcurrant", "Blueberry", "Boysenberry", "Currant", "Cherry", "Cherimoya", "Chico fruit", "Cloudberry", "Coconut", "Cranberry", "Cucumber", "Damson", "Date", "Dragonfruit", "Durian", "Elderberry", "Feijoa", "Fig", "Gooseberry", "Grape", "Raisin", "Grapefruit", "Guava", "Honeyberry", "Huckleberry", "Jabuticaba", "Jackfruit", "Jambul", "Jujube", "Kiwano", "Kiwifruit", "Kumquat", "Lemon", "Lime", "Loquat", "Longan", "Lychee", "Mango", "Mangosteen", "Marionberry", "Melon", "Cantaloupe", "Honeydew", "Watermelon", "Mulberry", "Nectarine", "Nance", "Olive", "Orange", "Clementine", "Mandarine", "Tangerine", "Papaya", "Passionfruit", "Peach", "Pear", "Persimmon", "Physalis", "Plantain"];
  let guessesRemaining = 6;
  let word = words[Math.floor(Math.random() * words.length)];
  let wordSoFar = Array(word.length + 1).join("-");
  let lettersGuessed = [];
  let playerName = null;
  let playerWins = 0;

  function updateScoreboard() {
    let leaderboard = JSON.parse(sessionStorage.getItem("leaderboard")) || {};
    if (playerName in leaderboard) {
      leaderboard[playerName] = playerWins;
    } else {
      leaderboard[playerName] = 0;
    }
    playerWins = leaderboard[playerName];
    if ($("#scoreboard-body td:contains('" + playerName + "')").length) {
      $("#scoreboard-body td:contains('" + playerName + "')").next().text(playerWins);
    } else {
      $("#scoreboard-body").append("<tr><td>" + playerName + "</td><td>" + playerWins + "</td></tr>");
    }
    sessionStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }

  function updateUI() {
    $("#player-name").text(playerName);
    $("#player-wins").text(playerWins);
    $("#guesses").text(guessesRemaining);
    $("#word").text(wordSoFar);
  }

  function resetGame() {
    guessesRemaining = 6;
    word = words[Math.floor(Math.random() * words.length)];
    wordSoFar = Array(word.length + 1).join("-");
    lettersGuessed = [];
    updateUI();
  }

  $("#start-form").submit(function (event) {
    event.preventDefault();
    playerName = $("#player-name-input").val().trim();
    if (playerName === "") {
      $("#start-feedback").text("Please enter a player name.");
    } else {
      $("#start-screen").hide();
      updateScoreboard();
      updateUI();
      $("#game-screen").show();
    }
  });

  $("#guess-form").submit(function (event) {
    event.preventDefault();
    let guess = $("#guess").val().toLowerCase();
    if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
      $("#feedback").text("Please enter a single letter.");
    } else if (lettersGuessed.indexOf(guess) !== -1) {
      $("#feedback").text("You already guessed that letter.");
    } else {
      lettersGuessed.push(guess);
      if (word.indexOf(guess) !== -1) {
        for (let i = 0; i < word.length; i++) {
          if (word[i] === guess) {
            wordSoFar = wordSoFar.substr(0, i) + guess + wordSoFar.substr(i + 1);
          }
        }
        updateUI();
        if (wordSoFar.indexOf("-") === -1) {
          $("#feedback").text("You win!");
          playerWins++;
          updateScoreboard();
          resetGame();
        } else {
          $("#feedback").text("Good guess!");
        }
      } else {
        guessesRemaining--;
        updateUI();
        if (guessesRemaining === 0) {
          $("#feedback").text("You lose! The word was " + word + ".");
          updateScoreboard();
          resetGame();
        } else {
          $("#feedback").text("Sorry, that letter is not in the word.");
        }
      }
    }
    $("#guess").val("");
  });

  $("#reset-leaderboard-button").click(function (event) {
    event.preventDefault();
    sessionStorage.removeItem("leaderboard");
    location.reload();
  });

  if (sessionStorage.getItem("leaderboard") === null) {
    sessionStorage.setItem("leaderboard", JSON.stringify({}));
  }
});
