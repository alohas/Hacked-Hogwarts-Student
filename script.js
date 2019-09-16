const template = document.querySelector("#myTemp").content;
const link = "https://petlatkea.dk/2019/hogwartsdata/students.json";
const parent = document.querySelector("ul.fulllist");
const modal = document.querySelector(".bg-modal");
const modalbg = document.querySelector(".modal-content");
const dropdown = document.querySelector("select");
let primaryData = [];
let usableData = [];
let expelledData = [];
let filteredData = [];

let prefectCounter = {
  Gryffindor: 0,
  Slytherin: 0,
  Hufflepuff: 0,
  Ravenclaw: 0
};

const protoStudent = {
  firstname: "",
  lastname: "",
  house: "",
  gender: "",
  nickname: "",
  middlename: "",
  expelled: "",
  prefect: ""
};

window.addEventListener("DOMContentLoaded", init(link));
dropdown.addEventListener("change", filterOut);
document.querySelector("#fname").addEventListener("click", sortByFirst);
document.querySelector("#lname").addEventListener("click", sortByLast);
document.querySelector("#reverse").addEventListener("click", reverseArray);
document.querySelector("#expellButton").addEventListener("click", expell);
document.querySelector("#prefectButton").addEventListener("click", prefect);

document.addEventListener("click", function(e) {
  if (e.target.nodeName == "LI") {
    popModal(e.target.getAttribute("id"));
  }
});

document.querySelector("#close").addEventListener("click", function() {
  modal.classList.add("hide");
});

function init(link) {
  fetch(link)
    .then(e => e.json())
    .then(data => {
      primaryData = data;
      fixData(data);
      displayData(filteredData);
    });
}

function fixData(students) {
  //console.log(students);
  students.forEach(studentJson => {
    const student = Object.create(protoStudent);

    //console.log(student);

    let endOfFirstName = studentJson.fullname.trim().indexOf(" ");
    student.firstname = capitalize(studentJson.house.trim());
    if (endOfFirstName > 0) {
      student.firstname = capitalize(
        studentJson.fullname.trim().substring(0, endOfFirstName)
      );
      if ((studentJson.fullname.trim().match(/ /g) || []).length == 2) {
        if (studentJson.fullname.trim()[endOfFirstName + 1] == '"') {
          student.nickname = studentJson.fullname
            .trim()
            .substring(
              studentJson.fullname.trim().indexOf('"') + 1,
              studentJson.fullname.trim().lastIndexOf('"')
            );
          student.lastname = studentJson.fullname
            .trim()
            .substring(
              studentJson.fullname.trim().lastIndexOf(" ") + 1,
              studentJson.fullname.trim().length
            );
        } else {
          student.middlename = capitalize(
            studentJson.fullname
              .trim()
              .substring(
                studentJson.fullname.trim().indexOf(" ") + 1,
                studentJson.fullname.trim().lastIndexOf(" ")
              )
          );
          student.lastname = capitalize(
            studentJson.fullname
              .trim()
              .substring(
                studentJson.fullname.trim().lastIndexOf(" ") + 1,
                studentJson.fullname.trim().length
              )
          );
        }
      } else {
        student.middlename = false;
        student.nickname = false;
        student.lastname = capitalize(
          studentJson.fullname
            .trim()
            .substring(
              studentJson.fullname.trim().indexOf(" ") + 1,
              studentJson.fullname.trim().length
            )
        );
      }
    } else {
      student.firstname = capitalize(studentJson.fullname.trim());
      student.lastname = "~Unknown~";
      student.nickname = false;
      student.middlename = false;
    }
    student.house = capitalize(studentJson.house.trim());
    student.gender = studentJson.gender;
    usableData.push(student);
  });
  filteredData = usableData;
}

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function displayData(students) {
  parent.innerHTML = "";
  console.log(students);
  students.forEach(student => {
    let clone = template.cloneNode(true);

    clone.querySelector(".first-name").textContent = student.firstname;
    if (student.lastname) {
      clone.querySelector(".last-name").textContent = student.lastname;
    } else {
      clone.querySelector(".last-name").textContent = "~Unknown~";
    }
    clone.querySelector(".house").textContent = student.house;

    clone.querySelector("li").setAttribute("id", student.firstname);

    parent.appendChild(clone);
  });
}

function popModal(studentName) {
  let filteredStudent = filteredData.filter(
    studentObject => studentObject.firstname === studentName
  )[0];

  document.querySelector("h5.expelled").classList.add("hide");
  document.querySelector("#prefectButton").disabled = false;
  document
    .querySelector("#expellButton")
    .setAttribute("value", filteredStudent.firstname);
  document
    .querySelector("#prefectButton")
    .setAttribute("value", filteredStudent.firstname);

  modal.querySelector(".name").textContent =
    "First Name: " + filteredStudent.firstname;

  if (filteredStudent.middlename) {
    modal.querySelector(".middlename").textContent =
      "Middle Name: " + filteredStudent.middlename;
  } else {
    modal.querySelector(".middlename").textContent = "Middle Name: -";
  }

  if (filteredStudent.nickname) {
    modal.querySelector(".nickname").textContent =
      "Nickname: " + filteredStudent.nickname;
  } else {
    modal.querySelector(".nickname").textContent = "Nickname: -";
  }

  if (filteredStudent.lastname) {
    modal.querySelector(".lastname").textContent =
      "Last Name: " + filteredStudent.lastname;
  } else {
    modal.querySelector(".lastname").textContent = "Last Name: -";
  }

  modal.querySelector(".house").textContent = "House: " + filteredStudent.house;

  if (filteredStudent.house == "Slytherin") {
    document.querySelector(".wrap-crest > img").src = "images/Slytherin.png";
    modalbg.style.backgroundImage = "linear-gradient(#0D6217, #AAAAAA)";
    modalbg.style.color = "black";
  } else if (filteredStudent.house == "Gryffindor") {
    document.querySelector(".wrap-crest > img").src = "images/Gryffindor.png";
    modalbg.style.backgroundImage = "linear-gradient(#7F0909, #FFC500)";
    modalbg.style.color = "black";
  } else if (filteredStudent.house == "Hufflepuff") {
    document.querySelector(".wrap-crest > img").src = "images/Hufflepuff.png";
    modalbg.style.backgroundImage = "linear-gradient(#EEE117, #000000)";
    modalbg.style.color = "white";
  } else if (filteredStudent.house == "Ravenclaw") {
    document.querySelector(".wrap-crest > img").src = "images/Ravenclaw.png";
    modalbg.style.backgroundImage = "linear-gradient(#000A90, #946B2D)";
    modalbg.style.color = "white";
  }

  if (filteredStudent.lastname.indexOf("-") > 0) {
    modal.querySelector(".wrap-profile > img").src =
      "images/" +
      filteredStudent.lastname.substring(
        filteredStudent.lastname.indexOf("-") + 1,
        filteredStudent.lastname.length
      ) +
      "_" +
      filteredStudent.firstname.charAt(0).toLowerCase() +
      ".png";
  } else if (filteredStudent.lastname == "Patil") {
    // ------------------------- FAKE - FIX TO CHECK FOR SAME LAST NAME ----------------------
    modal.querySelector(".wrap-profile > img").src =
      "images/" +
      filteredStudent.lastname.toLowerCase() +
      "_" +
      filteredStudent.firstname.toLowerCase() +
      ".png";
    // ---------------------------------------------------------------------------------------
  } else if (filteredStudent.lastname == "~Unknown~") {
    modal.querySelector(".wrap-profile > img").classList.add("hide");
  } else {
    modal.querySelector(".wrap-profile > img").src =
      "images/" +
      filteredStudent.lastname.toLowerCase() +
      "_" +
      filteredStudent.firstname.charAt(0).toLowerCase() +
      ".png";
  }

  if (filteredStudent.expelled) {
    document.querySelector("#expellButton").disabled = true;
    document.querySelector("#prefectButton").disabled = true;
    document.querySelector("h5.expelled").classList.remove("hide");
  } else {
    document.querySelector("#expellButton").disabled = false;
  }
  if (filteredStudent.prefect) {
    document.querySelector("h3.prefected").textContent =
      "Prefect of " + filteredStudent.house + " house";
    document.querySelector("#prefectButton").disabled = true;
  } else {
    document.querySelector("h3.prefected").textContent = "";
  }

  if (prefectCounter.Slytherin >= 2) {
    document.querySelector("#prefectButton").disabled = true;
  } else if (prefectCounter.Gryffindor >= 2) {
    document.querySelector("#prefectButton").disabled = true;
  } else if (prefectCounter.Ravenclaw >= 2) {
    document.querySelector("#prefectButton").disabled = true;
  } else if (prefectCounter.Hufflepuff >= 2) {
    document.querySelector("#prefectButton").disabled = true;
  }

  modal.classList.remove("hide");
}

function filterOut() {
  //console.log(dropdown.value);
  if (dropdown.value == "All") {
    filteredData = usableData;
    displayData(filteredData);
  } else if (dropdown.value == "Expelled") {
    filteredData = usableData.filter(
      studentObject => studentObject.expelled === true
    );
    displayData(filteredData);
  } else {
    filteredData = usableData.filter(
      studentObject => studentObject.house === dropdown.value
    );
    displayData(filteredData);
  }
  document.querySelector("#reverse").disabled = true;
}

function sortByFirst() {
  filteredData = filteredData.sort(function(a, b) {
    return a.firstname.localeCompare(b.firstname);
  });
  displayData(filteredData);
  document.querySelector("#reverse").disabled = false;
}

function sortByLast() {
  filteredData = filteredData.sort(function(a, b) {
    return a.lastname.localeCompare(b.lastname);
  });
  displayData(filteredData);
  document.querySelector("#reverse").disabled = false;
}

function reverseArray() {
  filteredData = filteredData.reverse();
  displayData(filteredData);
}

function expell() {
  //console.log(event.target.value);

  for (let counter = 0; counter < usableData.length; counter++) {
    if (usableData[counter].firstname === event.target.value) {
      usableData[counter].expelled = true;
      usableData[counter].prefect = false;
      filteredData = usableData;
      expelledData.push(usableData[counter]);
    }
  }
  document.querySelector("h3.prefected").textContent = "";
  document.querySelector("#optionExpelled").classList.remove("hide");
  document.querySelector("#expellButton").disabled = true;
  document.querySelector("#prefectButton").disabled = true;
  document.querySelector("h5.expelled").classList.remove("hide");
}

function prefect() {
  for (let counter = 0; counter < usableData.length; counter++) {
    if (usableData[counter].firstname === event.target.value) {
      usableData[counter].prefect = true;
      filteredData = usableData;

      document.querySelector("h3.prefected").textContent =
        "Prefect of " + usableData[counter].house + " house";

      if (usableData[counter].house == "Slytherin") {
        prefectCounter.Slytherin++;
      } else if (usableData[counter].house == "Gryffindor") {
        prefectCounter.Gryffindor++;
      } else if (usableData[counter].house == "Hufflepuff") {
        prefectCounter.Hufflepuff++;
      } else if (usableData[counter].house == "Ravenclaw") {
        prefectCounter.Ravenclaw++;
      }
    }
  }
  document.querySelector("#prefectButton").disabled = true;
}