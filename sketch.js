var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

//variables feed y lastFed 
var feed, lastFed;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
}

function setup(){
  database=firebase.database();
  createCanvas(1000,500);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //boton Alimentar al perro
  feed=createButton("Alimenta al perro");
  feed.position(860,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Agregar Alimento");
  addFood.position(1000,95);
  addFood.mousePressed(addFoods);
}

function draw(){
  background(46,139,87);
  foodObj.display();

  //código para leer el valor de tiempo de alimentación de la base de datos
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  //código para mostrar el texto lastFed time aquí
  fill("white");
  textSize(20);
  if(lastFed>= 12){
    text("Última hora en que se alimentó : "+ lastFed%12 + " PM", 50,30);
  }else if(lastFed== 0){
    text("Última hora en que se alimentó: 12 AM", 50, 50);
  }else{
    text("Última hora en que se alimentó : "+ lastFed + " AM", 50,30);
  }

  //text(mouseX+','+mouseY, mouseX, mouseY);
 
  drawSprites();
}

//función para leer la Existencia de alimento
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  //escribe el código aquí para actualizar las existencia de alimento, y la última vez que se alimentó al perro
  var food_stock_val= foodObj.getFoodStock();
  if(food_stock_val<= 0){
    foodObj.updateFoodStock(food_stock_val *0);
  }else{
    foodObj.updateFoodStock(food_stock_val -1);
  }
}

//funcón para agregar alimento al almacén
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
