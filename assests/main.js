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

let hpCountries = [];

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
      if (isLoading) {
         loader.classList.remove('d-none');
      } else {
         loader.classList.add('d-none');
         parentElement.style.position = 'unset';
      }
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
         loadCountries(`${apiUrl}region/${region}`, displayCountries);
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

         await loadCountries(`${apiUrl}name/${countryName}/?fullText=true`, displayCountryDetails);


      }
   }

   $('.back-btn').onclick = () => {
      generalContainer.classList.remove('d-none');
      detailsContainer.classList.add('d-none');
   }

}

const loadCountries = async (api, callback) => {
   try {
      isLoading = true;
      const res = await fetch(api);
      hpCountries = await res.json();
      if(typeof callback === 'function') {
         callback(hpCountries);
      }
      isLoading = false;
   } catch (err) {
      console.log(err);
   }
}
// Render

const displayCountries = countries => {
   const htmlString = countries
      .map(country => `
      <div class="col-3 g-0">
         <div class="country">
            <img src="${country.flag}" alt="" class="country__ensign">
            <div class="country__info">
               <h4 class="name">${country.name}</h4>
               <span class="population-desc desc">
                  Population: 
                  <span class="population-info info">${numberWithCommas(country.population)}</span>
               </span>
               <span class="region-desc desc">
                  Region: 
                  <span class="region-info info">${country.region}</span>
               </span>
               <span class="capital-desc desc">
                  Capital: 
                  <span class="capital-info info">${country.capital}</span>
               </span>
            </div>
         </div>
      </div>
      `)
      .join('');
   rowAllCountries.innerHTML = htmlString;

}

const displayCountryDetails = async countries => {
   const country = countries[0];
   const getCountryName = async borderCountryCode => {
      let borderCountryName;
      await loadCountries(`${apiUrl}alpha/${borderCountryCode}`, data => {
         borderCountryName = data.name;
      })
      return borderCountryName;
   }
   const renderBorders = () => {
      country.borders.forEach(async borderCountryCode => {
         const newElement = document.createElement('span');
         const borderCountryName = await getCountryName(borderCountryCode);
         newElement.innerHTML = 
            `<button onclick="loadCountries(\`${apiUrl}name/${borderCountryName}/?fullText=true\`, displayCountryDetails)" class="btn border-country-btn">
               ${borderCountryName}
            </button>`;
         $('.border-country').append(newElement);
      })
   }

   detailCountry.innerHTML = `
      <img src="${country.flag}" alt="" class="country__img">
      <section class="country__info">
         <h2 class="country__info-name">${country.name}</h2>
         <div class="row g-0">
            <div class="col-6">
               <div class="info-left-content info-content">

                  <span class="native-name-desc desc">
                     Native Name: 
                     <span class="native-name-info info">${country.nativeName}</span>
                  </span>
                  <span class="population-desc desc">
                     Population: 
                     <span class="population-info info">${numberWithCommas(country.population)}</span>
                  </span>
                  <span class="region-desc desc">
                     Region: 
                     <span class="region-info info">${country.region}</span>
                  </span>
                  <span class="sub-region-desc desc">
                     Sub Region: 
                     <span class="sub-region-info info">${country.subregion}</span>
                  </span>
                  <span class="capital-desc desc">
                     Capital: 
                     <span class="capital-info info">${country.capital}</span>
                  </span>
               </div>
            </div>
            <div class="col-6">
               <div class="info-right-content info-content">

                  <span class="top-domain-desc desc">
                     Top Level Domain: 
                     <span class="top-domain-info info">${country.topLevelDomain.join(', ')}</span>
                  </span>
                  <span class="currencies-desc desc">
                     Currencies: 
                     <span class="currencies-info info">${country.currencies.map(currencie => currencie.name).join(', ')}</span>
                  </span>
                  <span class="languages-desc desc">
                     Languages: 
                     <span class="languages-info info">${country.languages.map(language => language.name).join(', ')}</span>
                  </span>
               </div>
            </div>
         </div>
         <div class="border-country">
            <span class="border-country-desc">Border Countries: </span>
         </div>
      </section>
      `
   await renderBorders()



}





const app = () => {
   darkmode();

   loadCountries(allApi, displayCountries);

   handleEvents();

   loading(detailsContainer);

}

app();