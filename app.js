var check = function(element) {
  var regex = new RegExp('[a-zA-Z]+[0-9][0-9]');
  var password = element.value;
  var result = zxcvbn(password);
  var div = document.getElementById('debug');

  var feedback = _.get(result, 'feedback');
  div.innerHTML = feedback.warning + '\n';
  _.forEach(feedback.suggestions, function(val) {
    div.innerHTML += val + '\n';
  })

  console.log(password, regex.test(password));
  _.forEach(_.keys(result), function(key, arrkey) {
    console.log(_.get(result, key), key);
  })
  console.log(result);
}