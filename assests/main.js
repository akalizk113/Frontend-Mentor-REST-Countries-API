const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const darkModeBtn = $('.btn.dark-mode-btn');
const rowAllCountries = $('.container-1440 > .row');
const dropDownItems = $$('.filter-nav__item');
const dropDownTitle = $('.filter-menu__title');
const allApi = `https://restcountries.eu/rest/v2/all`;
const apiUrl = `https://restcountries.eu/rest/v2/`;
// Function
const darkmode = () => {
   darkModeBtn.onclick = () => {
      $('body').classList.toggle('dark-mode')
   }
}


function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


const render = async api => {
   await fetch(api)
      .then(response => response.json())
      .then(data => {
         const htmls = data.map(value => `
         <div class="col-3 g-0">
         <div class="country">
            <img src="${value.flag}" alt="" class="country__ensign">
            <div class="country__info">
               <h4 class="name">${value.name}</h4>
               <span class="population-desc desc">
                  Population: 
                  <span class="population-info info">${numberWithCommas(value.population)}</span>
               </span>
               <span class="region-desc desc">
                  Region: 
                  <span class="region-info info">${value.region}</span>
               </span>
               <span class="capital-desc desc">
                  Capital: 
                  <span class="capital-info info">${value.capital}</span>
               </span>
            </div>
         </div>
      </div>
         `)
         return htmls.join('');
      })
      .then(html => {
         rowAllCountries.innerHTML = html;
      })
}

const handleEvents = () => {
   // Drop down menu onclick
   dropDownItems.forEach(item => {
      item.onclick = e => {
         const region = e.target.innerHTML;
         dropDownTitle.innerHTML = `
         ${region}
         <div class="nav-icon">
                  <ion-icon name="chevron-down-outline"></ion-icon>
         </div>
         `
         render(`${apiUrl}region/${region}`);
      }
   })
}





const app = () => {
   darkmode();

   render(allApi);

   handleEvents();
}

app();


// fetch('https://restcountries.eu/rest/v2/all')
//    .then(response => response.json())
//    .then(data => {
//       console.log(data);
//    })


