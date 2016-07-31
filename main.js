// var weatherApp = function () {

  var getFromLocalStorage = function () {
    return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }
  
  var STORAGE_ID = 'weatherapp';
  var cities = getFromLocalStorage();
  // var $posts = $('.posts');


  var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(allCities.cities));
  }

  var source = $('#city-template').html();
  var template = Handlebars.compile(source);

  var allCities = {
    cities: getFromLocalStorage()
  }


var searchCity = function(cityName)  {
  var urlPrefix = "http://api.openweathermap.org/data/2.5/weather?q="
  var urlPost = "&APPID=6eec5d035cb87b2856d012fe2a6b73de"

  $.get(urlPrefix + cityName + urlPost, function(result) {
      
        var cityDisplay = result.name;
        var cityWeatherK = result.main.temp.toFixed(2);
        var cityWeatherC = (result.main.temp - 273.15).toFixed(2);
        var cityWeatherF = ((result.main.temp * 9/5) - 459.67).toFixed(2);
        
        createCity(cityDisplay, cityWeatherF, cityWeatherC, cityWeatherK);
   })

  }

var createCity = function(cityDisplay, cityWeatherF, cityWeatherC, cityWeatherK) {
  var city = {
    cityDisplay: cityDisplay,
    cityWeatherC: cityWeatherC,
    cityWeatherK: cityWeatherK,
    cityWeatherF: cityWeatherF,
    comments:[]
  };
    allCities.cities.push(city);
    showCity(city);
    showCommentsOnReload();
    saveToLocalStorage();

}

var showCity = function(city) {
  var $allCities = $('.city-display');
  $allCities.empty();

  //handlebars 
  // append our new html to the page
  var newHTML = template(allCities);
  $('.city-display').append(newHTML);

      
}

var createComment = function (text, cityIndex){
  var comment = {text: text}
  // console.log(text)
  // console.log(cityIndex)
  allCities.cities[cityIndex].comments.push(comment);
  // console.log('city in array', allCities.cities[cityIndex])
  saveToLocalStorage();

}

var showComments = function (commentsList, index){
   $(commentsList).empty();

   // for (var i = 0; i < allCities.cities.length; i ++) {
    // var index = allCities.cities.indexOf(city);
    var city = allCities.cities[index]
    // console.log('ea city from the loop', city);
    // console.log('index of city from the loop', index);

    for (var j = 0; j <allCities.cities[index].comments.length; j ++) {
      var comment = allCities.cities[index].comments[j];
     

      var source = $('#comments-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(comment);
      $(commentsList).append(newHTML);
      // console.log(commentsList)
    
    }
}


var showCommentsOnReload = function (){
   $('.comments-list').empty();

  for(var i = 0; i < allCities.cities.length; i ++){

    for (var j = 0; j <allCities.cities[i].comments.length; j ++) {
      var comment = allCities.cities[i].comments[j];
     

      var source = $('#comments-template').html();
      var template = Handlebars.compile(source);
      var newHTML = template(comment);
      $('.comments-list').eq(i).append(newHTML);
    
    }
  }
}




  var removeItem = function (passedIndex) {
    
    
    allCities.cities.splice(passedIndex ,1);
    // console.log(allCities.cities);

    // $(this).closest(".cart-item-wrapper").remove();
    
    
    saveToLocalStorage();
  }

 //events

  $('.search-city').on('click',  function (e) {
  e.preventDefault();

    var cityName = $('#city-name').val();
      searchCity(cityName);
      
  });



$('.city-display').on('click', '.add-comment', function () {
  var text = $(this).siblings('.comment-name').val();

  // finding the index of the post in the page... will use it in #createComment
  var cityIndex = $(this).closest('.city-wrapper').index();
  
  // adds to the array in the correct position (or 'index')
  createComment(text, cityIndex);
  var target = $(this).prev().prev()
   // adds to the DOM element÷ in the correct position (or 'index')
  showComments(target, cityIndex);
  saveToLocalStorage();
  

});



$('.city-display').on('click','.remove-button', function () {
  // var item = $(this).getFromLocalStorage ()
  // var item = $(this).closest('.card').data();
  var cityIndex = $(this).closest('.city-wrapper').index();

  removeItem(cityIndex);
  $(this).closest('.city-wrapper').remove();
  saveToLocalStorage();
});


// }

// weatherApp();

showCity();
showCommentsOnReload();

