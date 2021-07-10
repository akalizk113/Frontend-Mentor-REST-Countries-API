const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

fetch('https://restcountries.eu/rest/v2/all')
   .then(response => response.json())
   .then(data => {
      console.log(data);
   })