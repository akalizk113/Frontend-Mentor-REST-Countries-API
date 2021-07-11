const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const darkModeBtn = $('.btn.dark-mode-btn');
const rowAllCountries = $('.container-1440 > .row');
const dropDownItems = $$('.filter-nav__item');
const dropDownTitle = $('.filter-menu__title');
const generalContainer = $('.general-container');
const detailsContainer = $('.detail-container')
const detailCountry = $('.detail-container .country');


const allApi = `https://restcountries.eu/rest/v2/all`;
const apiUrl = `https://restcountries.eu/rest/v2/`;

let isLoading = false;
// Function
const darkmode = () => {
   darkModeBtn.onclick = () => {
      $('body').classList.toggle('dark-mode')
   }
}


function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const loading = parentElement => {
   const loader = parentElement.querySelector('.loader');
   parentElement.style.position = 'relative';
   setInterval(() => {
      if(isLoading) {
         loader.classList.remove('d-none');
      }
      else {
         loader.classList.add('d-none');
         parentElement.style.position = 'unset';
      }
   })
}

// render

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

const renderDetails = async api => {
   const getCountryInfo = async api => {
      return await fetch(api)
         .then(response => response.json())
   }
   const renderBorders = borderCountriesCode => {  
      Promise.all(borderCountriesCode.map(async value => await getCountryInfo(`${apiUrl}alpha/${value}`)))
         .then(data => data.forEach(value => {
            const newCountry = document.createElement('span');
            newCountry.innerHTML = `<button onclick="renderDetails(\`${apiUrl}name/${value.name}/?fullText=true\`)" class="btn border-country-btn">${value.name}</button>`;
            $('.border-country').append(newCountry);
         }))
   }

   isLoading = true;
   await fetch(api)
      .then(response => response.json())
      .then(data => {
         const value = data[0];
         detailCountry.innerHTML =  `
            <img src="${value.flag}" alt="" class="country__img">
            <section class="country__info">
               <h2 class="country__info-name">${value.name}</h2>
               <div class="row g-0">
                  <div class="col-6">
                     <div class="info-left-content info-content">
   
                        <span class="native-name-desc desc">
                           Native Name: 
                           <span class="native-name-info info">${value.nativeName}</span>
                        </span>
                        <span class="population-desc desc">
                           Population: 
                           <span class="population-info info">${numberWithCommas(value.population)}</span>
                        </span>
                        <span class="region-desc desc">
                           Region: 
                           <span class="region-info info">${value.region}</span>
                        </span>
                        <span class="sub-region-desc desc">
                           Sub Region: 
                           <span class="sub-region-info info">${value.subregion}</span>
                        </span>
                        <span class="capital-desc desc">
                           Capital: 
                           <span class="capital-info info">${value.capital}</span>
                        </span>
                     </div>
                  </div>
                  <div class="col-6">
                     <div class="info-right-content info-content">
   
                        <span class="top-domain-desc desc">
                           Top Level Domain: 
                           <span class="top-domain-info info">${value.topLevelDomain.join(', ')}</span>
                        </span>
                        <span class="currencies-desc desc">
                           Currencies: 
                           <span class="currencies-info info">${value.currencies.map(currencie => currencie.name).join(', ')}</span>
                        </span>
                        <span class="languages-desc desc">
                           Languages: 
                           <span class="languages-info info">${value.languages.map(language => language.name).join(', ')}</span>
                        </span>
                     </div>
                  </div>
               </div>
               <div class="border-country">
                  <span class="border-country-desc">Border Countries: </span>
               </div>
            </section>
            `
            renderBorders(value.borders)
      })
   isLoading = false;
      
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

   // countries onclick
   rowAllCountries.onclick = async e => {
      if (e.target.closest('.country__ensign') || e.target.closest('.country__info')) {
         const country = e.target.closest('.country');
         const countryName = country.querySelector('.country__info .name').innerHTML;
         generalContainer.classList.add('d-none');
         detailsContainer.classList.remove('d-none');
         detailsContainer.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;

         await renderDetails(`${apiUrl}name/${countryName}/?fullText=true`);


      }
   }

   $('.back-btn').onclick = () => {
      generalContainer.classList.remove('d-none');
      detailsContainer.classList.add('d-none');
   }

}





const app = () => {
   darkmode();

   render(allApi);

   handleEvents();

   loading(detailsContainer);

}

app();


// fetch('https://restcountries.eu/rest/v2/all')
//    .then(response => response.json())
//    .then(data => {
//       console.log(data);
//    })