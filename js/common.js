let inkColors = 15,
  bgColors = 17;

// https://stackoverflow.com/a/8831937
String.prototype.hashCode = function () {
  var hash = 0;
  if (this.length == 0) {
    return hash;
  }
  for (var i = 0; i < this.length; i++) {
    var char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

function coverColorCode(initials, location, age, profession, gender) {
  let bgCodeSeed = gender + profession + location + age + initials;
  return (Math.abs(bgCodeSeed.hashCode()) % bgColors) + 1;
}

function inkColorCode(initials, location, age, profession, gender) {
  let inkCodeSeed = age + initials + location + profession + gender;
  return (Math.abs(inkCodeSeed.hashCode()) % inkColors) + 1;
}
