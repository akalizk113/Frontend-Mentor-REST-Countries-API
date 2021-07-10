const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const darkModeBtn = $('.btn.dark-mode-btn')

// Function
const darkmode = () => {
   darkModeBtn.onclick = () => {
      $('body').classList.toggle('dark-mode')
   }
}





const app = () => {
   darkmode();
}

app();


// fetch('https://restcountries.eu/rest/v2/all')
//    .then(response => response.json())
//    .then(data => {
//       console.log(data);
//    })