var check = function(element) {
  var password = element.value;
  var result = zxcvbn(password);
  console.log(result);
}