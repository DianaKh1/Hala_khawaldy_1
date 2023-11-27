
// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


// פונקציה להסתרת התמונה



let studentsArray = [
  "Kinda",
  "Rasha",
  "Reem",
  "Seren",
  "Shadan",
  "Rayan",
  "Maya",
  "Mariam",
  "Rahma",
  "Noran",
  "Atef",
  "Mayar",
  "Roba ghanayem",
  "Saja",
  "Shahed",
  "Lana",
  "Mohamed",
  "Lena",
  "None"
  // רשימת התלמידים השלמה
];

let chosenStudents = [];

function getRandomStudent() {
  let randomIndex = Math.floor(Math.random() * studentsArray.length);
  let chosenStudent = studentsArray[randomIndex];

  while (chosenStudents.includes(chosenStudent)) {
    randomIndex = Math.floor(Math.random() * studentsArray.length);
    chosenStudent = studentsArray[randomIndex];
  }

  chosenStudents.push(chosenStudent);
  return chosenStudent;
}

let chosenStudent = getRandomStudent();
document.querySelector('.category').innerText = chosenStudent;

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;
      console.log(qCount);

      // Create Bullets + Set Questions Count
      createBullets(qCount);

      
      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

     
      // Start CountDown
      countdown(60, qCount);


      

      
       
      

      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer
        
       
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;
      
        // Check The Answer
        
        checkAnswer(theRightAnswer, qCount);
        setTimeout(() => {
          quizArea.innerHTML = "";
          answersArea.innerHTML = "";
  
          // Add Question Data
            addQuestionData(questionsObject[currentIndex], qCount);
          
          // Handle Bullets Class
          handleBullets();
  
          // Start CountDown
          clearInterval(countdownInterval);
          countdown(60 , qCount);
  
          // Show Results
          showResults(qCount);
  
          if(currentIndex!== qCount){
            let chosenStudent = getRandomStudent();
            document.querySelector('.category').innerText = chosenStudent;} 
            else{
              document.querySelector('.category').innerText = "--The Result--";
            }

        }, 5000);
        
          
      };
     
  };


    
    
  };

  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
    

getQuestions();


function createBullets(num) {
//   countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {


  if (currentIndex < count) {
    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 4; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      if (i === 1) {
        radioInput.checked = true;
      }

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

const start = () => {
  setTimeout(function() {
      confetti.start()
  }, 10); // 1000 is time that after 1 second start the confetti ( 1000 = 1 sec)
};

//  Stop

const stop = () => {
  setTimeout(function() {
      confetti.stop()
  }, 2000); // 5000 is time that after 5 second stop the confetti ( 5000 = 5 sec)
};

const audio1 = new Audio('correct11.mp3');
const audio2 = new Audio('uncorrect1.mp3');
   
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
     
    }
  }

  if (rAnswer === theChoosenAnswer) {
    audio1.play();
    start();
    stop();
    rightAnswers++;
  }else { 
    showIncorrectImage();
    
     }
}


function showIncorrectImage() {
  let imagesArray=['1.jpg', '2.jpg',  '4.jpg','5.jpg', '6.jpg','7.jpg', '8.jpg','9.jpg','11.jpg','14.jpg','15.jpg'];
  let incorrectImageDiv = document.querySelector('.incorrect-answer-image');
  let randomIndex = Math.floor(Math.random() * imagesArray.length);
  let imagePath = imagesArray[randomIndex];

  // הוספת התמונה לאלמנט המתאים וכן שינוי האופקיות לשקיפות מלאה
  incorrectImageDiv.innerHTML = `<img src="${imagePath}" alt="Incorrect Answer Image" />`;
  incorrectImageDiv.firstChild.style.opacity = '1';
  incorrectImageDiv.firstChild.style.pointerEvents="auto";
  // טיימר להסתרת התמונה ועבר לשאלה הבאה
  setTimeout(() => {
    incorrectImageDiv.firstChild.style.opacity = '0';
    incorrectImageDiv.firstChild.style.pointerEvents="none";
     // הסתרת התמincorrectImageDiv.firstChild.style.pointerEvents="auto";ונה

    // המתנה לאחר 0.5 שניות (זמן האנימציה)
  }, 5000); // המתנה לאחר 5 שניות
}


  
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}


const audio = new Audio('halam.mp3');
function showResults(count) {
  console.log("show");
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();
    
   
  audio.play();
  
   start();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good" style="display: flex; flex-direction:column; align-items: center;" >  ${rightAnswers} correct answers out of ${count} <hr/> <img src="gif1.gif" alt="Description">  </span> `;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect" style="display: flex; flex-direction:column; align-items: center;" > ${rightAnswers} correct answers out of ${count} <hr/> <img src="gif1.gif" alt="Description">  </span> `
    } else {
      theResults = `<span class="bad" style="display: flex; flex-direction:column; align-items: center; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-weight: bolder; font-size: 20px;" > 
       ${rightAnswers} correct answers out of ${count} <hr/>  <img src="gif1.gif" alt="Description"></span> `;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "30px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
          // submitButton.click();
      }
    }, 1000);
  }
}
