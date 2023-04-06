function check() {
  let username = document.getElementById("username");
  console.log("hshshshsh");
  User.findOne({ username: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        console.log("found user");
        if (foundUser.password === password) {
          name = foundUser.fname;
          email = foundUser.email;
          loggedIn = true;
          return true;
        } else {
          alert("wrong pass");
          return false;
        }
      } else {
        alert("user does not exist");
        return false;
      }
    }
  });
}
module.exports = { check };
