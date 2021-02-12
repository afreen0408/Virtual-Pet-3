//Create variables here
var dog, dogImg,happyDog,database,foodS,foodStock;
var foodObj,fedTime,lastFed,feed,addFood;
var readState,gameState;
var bedImg,gardenImg,bathImg;
function preload()
{
	//load images here
  dogImg=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");
  bedImg=loadImage("images/Bed Room.png");
  gardenImg=loadImage("images/Garden.png");
  bathImg=loadImage("images/Wash Room.png");


}

function setup() {
	createCanvas(1200, 500);
  dog=createSprite(800,250,50,50);
  dog.addImage(dogImg);
  dog.scale=0.3
  database=firebase.database();
  foodStock=database.ref("Food");
  foodStock.on("value",readStock);

  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  foodObj= new Food();

  readState=database.ref("gameState");
  readState.on("value",function (data){
    gameState=data.val();
  })
}


function draw() { 
  background(46,139,87) 
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(dogImg);
   }
 
  drawSprites();

}
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  
  if(foodObj.getFoodStock()<= 0){
   foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
