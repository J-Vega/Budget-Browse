

const searchUrl_BESTBUY = "https://api.bestbuy.com/v1/products";
const apiKey_BESTBUY = "vrjst2v5zsgemp3jq44xwmz9";

//Changed when clicking category buttons. Used to change searchbutton color and text, as well as placeholders.
let listingCategory = ``;

//Used to display rendered results in pop up windows
let listings_BESTBUY = [];

//Toggled when displaying a popup window - resets when closed
let isPopUpDisplaying = false;

//Toggled while searching to prevent multiple queries from stacking on one another.
let isLoading = false;

//Search placeholder changes suggestions when choosing a category
currentPlaceholder = [];

let placeholderGroups = {
  appliance: ["Air Fryer", "Blender", "Coffee", "Toaster", "Iron"],
  gaming: ["3DS", "God of War", "Strategy Guides", " Halo", "Amiibo", "Controllers"],
  computer:["Dell","MacBook","Monitors","Hard Drives","RAM"],
  television:["Vizio","4k TV","Universal Remote","Sound Bar"],
  audio:['Beats','MP3','Ear Buds','Ipod'],
  mobile:['Samsung','Iphone','Pixel','Galaxy Note']
};

//Cycles through placeholder suggestions
setInterval(function() {
    $("input[type='text']").attr("placeholder", currentPlaceholder[currentPlaceholder.push(currentPlaceholder.shift())-1]);
}, 1500);

//Hides the popup backfade and 'clicks' the computer category on load
$(function() {
  $(".backFade").hide();
  document.getElementById('computerButton').click();
});

$(function() {
    $(".clickForPopUpBESTBUY").on("click",".bestbuy-result-block",event => {
      if(isPopUpDisplaying === false)
    { 
    isPopUpDisplaying = true;
      const itemIndex = BESTBUYgetIndexFromElement(event.currentTarget);
     
        hideListingFromScreenReader();
        $('.BESTBUYItemName').text(listings_BESTBUY[itemIndex].name);
        $('.BESTBUYImage').html(displayItemImage($(event.currentTarget).find(".thumbnail").attr("src")));
        $('.BESTBUYPrice').html(displayItemPrice(listings_BESTBUY[itemIndex].price));
        $('.BESTBUYDescription').html(displayItemDescription(listings_BESTBUY[itemIndex].description));
        $('.BESTBUYURL').html(displayItemURL(listings_BESTBUY[itemIndex].link));
        $("#BESTBUYpopUpWindow").show();
        $(".backFade").show();
      }else{}
    }); 
  
  
    $("#backButtonBestBuy").click(function() {
      if(isPopUpDisplaying === true){
        isPopUpDisplaying=false;
        showListingToScreenReader();
        $("#BESTBUYpopUpWindow").hide();
        $(".backFade").hide();
      }
      else{

      }
    });

    $('.backFade').on('click',function(event){
      if(isPopUpDisplaying === true){
        isPopUpDisplaying=false;
  
  $("#BESTBUYpopUpWindow").hide();
  $(".backFade").hide();}
});
});




$('.category').on('click',function(event){
  event.preventDefault();

  //Toggle opacity
  $('.category').removeClass('active');
  $(this).addClass('active');

  //Toggle arrow image
  $('.category').find('img').removeClass('show');
  $(this).find('img').addClass('show');

  listingCategory = $(this).closest('.category').attr('apiCategory');
  updatePlaceholder(listingCategory);
  
  changeFontColor(listingCategory);

  return listingCategory;
});

function changeFontColor(category){
  
  if(category === "Audio") {
    document.getElementById("searchButton").style.background = "#107b10";
    document.getElementById("searchButtonText").innerHTML = "Search Music, MP3s, Accessories, and more!";
  }
  else if(category === "Appliances") {
    document.getElementById("searchButton").style.background = "#24458c";
    document.getElementById("searchButtonText").innerHTML = "Search Kitchen, Indoor, Outdoor, and other Appliances!";
  }
  else if(category === "Video Games") {
    document.getElementById("searchButton").style.background = "#565656";
    document.getElementById("searchButtonText").innerHTML = "Search Video Games, Consoles, and more!";
  }
  else if(category === "TV") {
    document.getElementById("searchButton").style.background = "#c1282d";
    document.getElementById("searchButtonText").innerHTML = "Search Televisions, Movies, and more!";
  }
  else if(category === "Cell Phones") {
    document.getElementById("searchButton").style.background = "#ff5500";
    document.getElementById("searchButtonText").innerHTML = "Search Cell Phones, Accessories, and more!";
  }
  else if(category === "Computers") {
    document.getElementById("searchButton").style.background = "#adadad";
    document.getElementById("searchButtonText").innerHTML = "Search Computer Hardware, Software, and more!";
  }
}

function updatePlaceholder(category){
  if(category === "Audio") currentPlaceholder = placeholderGroups.audio;
  else if(category === "Appliances") currentPlaceholder = placeholderGroups.appliance;
  else if(category === "Video Games") currentPlaceholder = placeholderGroups.gaming;
  else if(category === "TV") currentPlaceholder = placeholderGroups.television;
  else if(category === "Cell Phones") currentPlaceholder = placeholderGroups.mobile;
  else if(category === "Computers") currentPlaceholder = placeholderGroups.computer;
}

function retrieveData(query,budget){
    BESTBUYgetDataFromApi(query,budget,BESTBUYdisplaySearchData);
}

function BESTBUYgetIndexFromElement(item){
  const itemIndexString = $(item).closest('.bestbuy-result-block').attr('item-index');
  return parseInt(itemIndexString,10);
}

function resetListing(){
  listings_BESTBUY = [];
}

function watchSubmit() {
  $('.js-search-form').submit(event => 
  {
    event.preventDefault();

    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    const budget = $(event.currentTarget).find('.js-query-budget').val();  
    retrieveData(query,budget);
  
  });
}

function resetForms(){ 
  window.scrollTo(0,0);
}

function hideSections(){
   $('h3').hide(0);
}

function showSections(){
   $('h3').show(0);
}

hideSections();

//---------- SCREEN READER FUNCTIONS----------

function hideListingFromScreenReader(){ //Causes screen reader to ignore listings when pop up is displayed
  document.getElementById("listingsParent").setAttribute("aria-hidden",true);
}

function showListingToScreenReader(){ //When pop up is exit, show listings to screen reader
  document.getElementById("listingsParent").setAttribute("aria-hidden",false);
}


// ---------    POP UP WINDOW FUNCTIONS       ------//

function displayItemImage(imageURL){
  return ` <img aria-hidden = "true" src=${imageURL} alt="Best Buy Product Image"> `;
}
function displayChannelURL(channel,itemURL){
  return ` <p>Channel:<span><a target="_blank" href=${itemURL}>${channel}</a></span></p> `;
}
function displayVideoURL(title, itemURL){
  return ` <a target="_blank" href=${itemURL}>${title}</a> `;
}
function displayItemURL(itemURL){
  return ` <a target="_blank" href=${itemURL}>Buy it Here!</a> `;
}
function displayItemDescription(description){
  return ` <p class = "justify itemDescription" aria-label="[Product Description]">${description} </p>`;
}
function displayItemPrice(price){
  return ` <p class="price bold" aria-label="[Price]">$${price} </p>`;
}
function displayLoadingMessage(searchTerm){
  return `<p>"Searching for ${searchTerm}"</p>`;
}


//-------- BEST BUY API -------//

function BESTBUYgetDataFromApi(searchTerm,budget,callback){
  resetListing();
  const query = {
    apiKey: apiKey_BESTBUY,
    keyword: `(search=${searchTerm})`,
    format: 'json' 
  };

  const tempUrl = 'https://api.bestbuy.com/v1/products((search='+searchTerm+')&regularPrice<'+budget+'&categoryPath.name='+listingCategory+'*)?apiKey=vrjst2v5zsgemp3jq44xwmz9&sort=regularPrice.desc&show=bestSellingRank,name,url,regularPrice,shortDescription,longDescription,image&pageSize=12&format=json';
  $.getJSON(tempUrl,callback);
} 

function BESTBUYdisplaySearchData(data){
  const results = data.products.map((item,index) => BESTBUYrenderResults(item,index));
  $('.js-search-results-BESTBUY').html(results);
}

function BESTBUYrenderResults(results,index){
  showSections();
  BESTBUYaddProductToListing(results);
  return `<div class="bestbuy-result-block col-4" item-index="${index}">
  <p aria-label="[Product Name]" class = "productName" >${results.name}</p>
  <div class="container"> <img aria-hidden = "true" class ="thumbnail" src="${results.image}"></div> 
  <p aria-label="[Price]" class="price bold">$${results.regularPrice}</p></div>
  `;
}

function BESTBUYaddProductToListing(listing){
  listings_BESTBUY.push({
    'name': listing.name, 
    'image':listing.image,
    'price': listing.regularPrice, 
    'description':listing.longDescription, 
    'link':listing.url});
}

$(watchSubmit);



//            END             //
