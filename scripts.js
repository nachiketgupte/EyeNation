function validate() {
  console.log("check");
  // Add the rest of your code here, as we have to wait a moment before the document has jQuery as a part of it.
  let fname = document.getElementById("firstName").value;
  let lname = document.getElementById("lastName").value;
  let valid = 1;
  if (fname.length < 3) {
    let validateName = document.getElementById("validateName");
    validateName.innerHTML = "Please Enter a Name";
    validateName.style.color = "red";
    valid = 0;
  } else {
    document.getElementById("validateName").style.display = "none";
  }

  if (lname.length < 3) {
    let validateName = document.getElementById("validateName");
    validateName.style.display = "block";
    validateName.innerHTML = "Please Enter a valid Name";
    validateName.style.color = "red";
    valid = 0;
  } else {
    document.getElementById("validateName").style.display = "none";
  }

  let dob = document.getElementById("dob").value;
  let year = parseInt(dob.slice(0, 4));
  let age = 2022 - year;

  if (age < 16) {
    let validateDOB = document.getElementById("validateDOB");
    validateDOB.innerHTML = "Minimum age required to sign up is 16";
    validateDOB.style.color = "red";
    valid = 0;
  } else {
    document.getElementById("validateDOB").style.display = "none";
  }

  // Username Validation -- using DB Connection

  // Password Validation
  let psw = document.getElementById("password").value;
  let lowerCaseLetters = /[a-z]/g;
  let upperCaseLetters = /[A-Z]/g;
  let numbers = /[0-9]/g;

  if (psw.length < 8) {
    document.getElementById("validate").innerHTML =
      "Password should have a minimum length of 8 letters";
    valid = 0;
  } else if (!psw.match(numbers)) {
    document.getElementById("validate").innerHTML =
      "Password must contain at least 1 number";
    valid = 0;
  } else if (!psw.match(lowerCaseLetters)) {
    document.getElementById("validate").innerHTML =
      "Password must contain at least 1 lower case letter";
    valid = 0;
  } else if (!psw.match(upperCaseLetters)) {
    document.getElementById("validate").innerHTML =
      "Password must contain at least 1 upper case letter";
    valid = 0;
  }
  if (valid == 1) {
    return true;
  } else {
    return false;
  }
}

function check() {
  let username = document.getElementById("username").value;
  console.log("hshshshsh2");
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
module.exports = { validate };
