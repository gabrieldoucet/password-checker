angular.module('passwordCheckerApp', [])
  .controller('passwordCheckerController', ['$http', '$scope', '$sce', function($http, $scope, $sce) {
    var MIN_DIGITS_COUNT = 2;
    var MIN_UPPERCASE_COUNT = 2;
    var MIN_LOWERCASE_COUNT = 2;
    var oldDigitState = 'NOK';
    var digitState = 'NOK';
    var oldUppercaseState = 'NOK';
    var uppercaseState = 'NOK';
    var oldLowercaseState = 'NOK';
    var lowercaseState = 'NOK';

    $scope.dictionnary = {};
    $scope.passwordSuggestions = [];
    $scope.words = {}
    $scope.result = {remarks: ''};
    $scope.showHelper = false;

    // Loading the dictionnary for password suggestion
    $http({method: 'GET', url: 'https://gdoucet-fr.github.io/passwordChecker/dictionnary.json'})
    .then(function (res) {
      $scope.dictionnary = res.data;
    }).catch(
      // Rejected promise
      function() { 
        $scope.dictionnary = _dictionnary;
      });

    var numberFeedback = function() {
      var numberFeedbackDiv = document.getElementById('number-feedback');
      if (!_.isEqual(oldDigitState, digitState)) {
        // Remove the existing glyphicon
        var fc = document.getElementById("icon-number-feedback");
        numberFeedbackDiv.removeChild(fc);
        
        // Create a new glyphicon
        var span = document.createElement('span');
        span.setAttribute("id", "icon-number-feedback");
        numberFeedbackDiv.appendChild(span);
        if (_.isEqual(digitState, 'OK')) { 
          span.className = "glyphicon glyphicon-ok gi-5x";
        } else if (_.isEqual(digitState, 'NOK')) {
          span.className = "glyphicon glyphicon-question-sign gi-5x";
        }
      }
    }

    var uppercaseFeedback = function() {
      var uppercaseFeedbackDiv = document.getElementById('uppercase-feedback');
      if (!_.isEqual(oldUppercaseState, uppercaseState)) {
        // Remove the existing glyphicon
        var fc = document.getElementById("icon-uppercase-feedback");
        uppercaseFeedbackDiv.removeChild(fc);
        
        // Create a new glyphicon
        var span = document.createElement('span');
        span.setAttribute("id", "icon-uppercase-feedback");
        uppercaseFeedbackDiv.appendChild(span);
        if (_.isEqual(uppercaseState, 'OK')) { 
          span.className = "glyphicon glyphicon-ok gi-5x";
        } else if (_.isEqual(uppercaseState, 'NOK')) {
          span.className = "glyphicon glyphicon-question-sign gi-5x";
        }
      }
    }

    var lowercaseFeedback = function() {
      var lowercaseFeedbackDiv = document.getElementById('lowercase-feedback');
      if (!_.isEqual(oldLowercaseState, lowercaseState)) {
        // Remove the existing glyphicon
        var fc = document.getElementById("icon-lowercase-feedback");
        lowercaseFeedbackDiv.removeChild(fc);
        
        // Create a new glyphicon
        var span = document.createElement('span');
        span.setAttribute("id", "icon-lowercase-feedback");
        lowercaseFeedbackDiv.appendChild(span);
        if (_.isEqual(lowercaseState, 'OK')) { 
          span.className = "glyphicon glyphicon-ok gi-5x";
        } else if (_.isEqual(lowercaseState, 'NOK')) {
          span.className = "glyphicon glyphicon-question-sign gi-5x";
        }
      }
    }

    var debugFeedback = function (score) {
      var progressbarScore = document.getElementById('progressbar-force');
      progressbarScore.setAttribute('aria-valuenow', 20 * (score + 1));

      var className;
      if (score <= 2) {
        className = 'progress-bar progress-bar-danger';
      } else if (score == 3) {
        className = 'progress-bar progress-bar-warning';
      } else if (score === 4) {
        className = 'progress-bar progress-bar-success';
      }
      progressbarScore.style.width = (20 * (score + 1)) + '%';;
      progressbarScore.className = className;
      progressbarScore.innerHTML = 'Score: ' + score;
    }

    var wordSuggestions = function(inputWord){
      var sameLetterWords = _.get($scope.dictionnary, inputWord.substring(0, 1));
      var suggestions = [];
      _.forEach(sameLetterWords, function(word) {
        if (word.length > inputWord.length) {
          if (_.isEqual(word.substring(0, inputWord.length), inputWord)) {
            suggestions.push(word);
          }
        }
      });
      suggestions = _.sortBy(suggestions, [function(word) {return word}]);
      var randomIndex = Math.floor(Math.random() * suggestions.length);
      return suggestions[randomIndex];
    };

    var checkAndSuggest = function(words) {
      words = _.map(words, function (word) {
        return _.upperFirst(word);
      });
      var password = words.join(' ');
      var score = zxcvbn(password).score;
      var newWords = [];
      $scope.result.zxcvbn = zxcvbn(password);

      if (words.length == 2) {
        if (score <= 2) {

        // If the first word is not long enough, find a longer word
        if ($scope.words.word1.length <= 4) {
          var newWord1 = wordSuggestions($scope.words.word1);
          newWords.push(newWord1);
        } else {
          newWords.push($scope.words.word1);
        }

        // If the second word is not long enough, find a longer word
        if ($scope.words.word2.length <= 4) {
          var newWord2 = wordSuggestions($scope.words.word2);
          newWords.push(newWord2);
        } else {
          newWords.push($scope.words.word2);
        }

        var randomNumber = Math.floor(Math.random() * 9);
        //newWords.push(randomNumber.toString());
        // Create the new password and recompute the score
        return checkAndSuggest(newWords);
        } else {
          return password;
        }
      } else {
        if (_.isEqual($scope.words.word1, '')) {

        }
        if (_.isEqual($scope.words.word1, '')) {

        }
      }
    };

    $scope.checkPassword = function() {

      var password = $scope.passwordTest;
      var result =  zxcvbn(password);
      var score = result.score;
      $scope.result.zxcvbn = result;
      debugFeedback(score);

      if (result.feedback.warning.indexOf('common') !== -1) {
        $scope.result.remarks = 'Commonly used';
      } else {
        $scope.result.remarks = '';
      }

      var digitRegex = /\d/g;
      var digitCount = _.isNull(password.match(digitRegex)) ? 0 : password.match(digitRegex).length ;
      oldDigitState = digitState;
      if (digitCount >= MIN_DIGITS_COUNT) {
        digitState = 'OK';
      } else {
        digitState = 'NOK';
      }

      var uppercaseRegex = /[A-Z]/g;
      var uppercaseCount = _.isNull(password.match(uppercaseRegex)) ? 0 : password.match(uppercaseRegex).length ;
      oldUppercaseState = uppercaseState;
      if (uppercaseCount >= MIN_UPPERCASE_COUNT) {
        uppercaseState = 'OK';
      } else {
        uppercaseState = 'NOK';
      }

      var lowercaseRegex = /[a-z]/g;
      var lowercaseCount = _.isNull(password.match(lowercaseRegex)) ? 0 : password.match(lowercaseRegex).length ;
      oldLowercaseState = lowercaseState;
      if (lowercaseCount >= MIN_LOWERCASE_COUNT) {
        lowercaseState = 'OK';
      } else {
        lowercaseState = 'NOK';
      }

      numberFeedback();
      lowercaseFeedback();
      uppercaseFeedback();
    };

    $scope.createPassword = function () {
      var words = [];
      _.forEach($scope.words, function (inputWord) {
        words.push(inputWord);
      });
      var finalPassword = checkAndSuggest(words);
      $scope.result.finalPassword = $sce.trustAsHtml(finalPassword.replace(/\s/g, '&#9251'));

//      console.log($scope.passwordSuggestions);
    };

    $scope.triggerHelper =function () {
      $scope.showHelper = !$scope.showHelper;
    }
  }]);