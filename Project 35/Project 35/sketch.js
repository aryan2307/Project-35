//Create variables here
var dog, dogImg, happyDogImg, database, foodS, foodStock, feedButton, addButton, fedTime, lastFed, foodObj;

function preload(){
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  foodStock = database.ref('Food');
  foodStock.on('value', readStock);
  dog = createSprite(250,200,50,50);
  dog.addImage(dogImg);
  //dog.addImage(happyDogImg);
  dog.scale = 0.35;
  foodObj = new Food();
  feedButton = createButton("Feed the dog");
  feedButton.position(600,95);
  feedButton.mousePressed(feedDog);

  addButton = createButton("Add food");
  addButton.position(700,95);
  addButton.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);
  drawSprites();
  text(foodS, 250, 330, fill(255));
  //add styles here
  dog.display();
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
}

function readStock(data){
  foodS = data.val();
}

function writeStock(x){
  if(x<0){
    x=0;
  }
  else{
    x=x-1;
    }
    database.ref('/').update({Food:x});
  }

  function feedDog(){
    dog.addImage(happyDogImg);
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
    database.ref('/').update({
      Food:foodObj.getFoodStock(),
      FeedTime:hour()
    })
  }

  function addFoods(){
    foodS++;
    database.ref('/').update({
      Food:foodS
    })
  }