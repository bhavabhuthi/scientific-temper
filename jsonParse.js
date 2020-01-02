fetch('jsonData.json')
  .then(response => response.json())
  .then(jsonResponse => process(jsonResponse));

// const response = await fetch('jsonData.json');
// const myJson = await response.json();
// console.log(myJson);



// document.getElementById('title').innerHTML = "Didn't work";

function process(jsonResponse) {
  var sciData = jsonResponse;
  var random_index = Math.floor(Math.random() * 48);
  document.getElementById('type').innerHTML = sciData[random_index].type;
  document.getElementById('title').innerHTML = sciData[random_index].title;
  document.getElementById('desc').innerHTML = sciData[random_index].description;
  document.getElementById('example').innerHTML = sciData[random_index].example;
}
