var MIN_DIGITS_COUNT = 4;
var MIN_UPPERCASE_COUNT = 4;
var MIN_LOWERCASE_COUNT = 4;
var uppercaseReq = false;
var oldDigitState = 'NOK';
var digitState = 'NOK';
var oldUppercaseState = 'NOK';
var uppercaseState = 'NOK';
var oldLowercaseState = 'NOK';
var lowercaseState = 'NOK';

var check = function(element) {
  var regex = new RegExp('[a-zA-Z]+[0-9][0-9]');

  var password = element.value;

  debugFeedback(password);

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
}

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

var debugFeedback = function (password) {
  var result = zxcvbn(password);
  var feedback = _.get(result, 'feedback');

  var ulSuggestions = document.getElementById('ul-suggestions');
  while (ulSuggestions.firstChild) {
    ulSuggestions.removeChild(ulSuggestions.firstChild);
  }
  _.forEach(feedback.suggestions, function(val) {
    var li = document.createElement('li');
    li.innerHTML = val;
    ulSuggestions.appendChild(li);
  });

  document.getElementById('span-warning').innerHTML = feedback.warning;

  var score = result.score;
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
  console.log((20 * (score + 1)));
  progressbarScore.style.width = (20 * (score + 1)) + '%';;
  progressbarScore.className = className;
  progressbarScore.innerHTML = 'Score: ' + score;
  document.getElementById('span-score').innerHTML = result.score;
  console.log(result);
}