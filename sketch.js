let player;
var dude;
let item;
const SPEED = 3;


let NPCS = [];
let KIDS = [];
let children = []; 
let items = [];
let activeItem = null;
let itemsOnShelves = [];


const MAX_CHILDREN = 3; 
const CHILD_SPAWN_RATE = 0.01; 
const CHILD_SCALE = 0.7; 


const SHELVES = [
  { name: "top shelf", x: 0, y: 170, width: 300, height: 100, items: ["tissues", "sauce"] },
  { name: "middle shelf", x: 0, y: 440, width: 300, height: 100, items: ["waterbottle", "bottle"] },
  { name: "bottom shelf", x: 30, y: 700, width: 160, height: 100, items: ["corn"] }
];

function preload() {
  dude = loadImage("imgs/dude.png");
  gal = loadImage("imgs/gal.png");
  person1 = loadImage("imgs/person1.png");
  person2 = loadImage("imgs/person2.png");
  person3 = loadImage("imgs/person3.png");
  person4 = loadImage("imgs/person4.png");
  person5 = loadImage("imgs/person5.png");
  person6 = loadImage("imgs/person6.png");
  person7 = loadImage("imgs/person7.png");
  person8 = loadImage("imgs/person8.png");
  person9 = loadImage("imgs/person9.png");
  child1 = loadImage("imgs/child1.png");
  child2 = loadImage("imgs/child2.png");
  child3 = loadImage("imgs/child3.png");
  child4 = loadImage("imgs/child4.png");
  shelves1 = loadImage("imgs/shelves1.png");
  shelves2 = loadImage("imgs/shelves2.png");
  shelf3 = loadImage("imgs/shelf3.png");
  shelf4 = loadImage("imgs/shelf4.png");
  shoppingCart = loadImage("imgs/shopping-cart.png");
  shoppingCartFull = loadImage("imgs/shopping-cart-full.png");
  checkout = loadImage("imgs/checkout-counter.png");
  cardbox = loadImage("imgs/cardboard-box.png");
  corn = loadImage("imgs/corn.png");
  sauce = loadImage("imgs/sauce.png");
  waterbottle = loadImage("imgs/waterbottle.png");
  tissues = loadImage("imgs/tissues.png");
  bottle = loadImage("imgs/bottle.png");

  

  NPCS = [person1, person2, person3, person4, person5, person6, person7, person8, person9];
  KIDS = [child1, child2, child3, child4];
  ITEMS = [
    { image: corn, name: "corn" },
    { image: sauce, name: "sauce" },
    { image: waterbottle, name: "waterbottle" },
    { image: tissues, name: "tissues" },
    { image: bottle, name: "bottle" }
  ];
}



    
function setup() {
  createCanvas(900, 900);
  drawFloor();
  player = new Sprite();
  player.image = dude;
  player.image.scale = 0.3;
  player.collider = 'dynamic';
  player.rotationLock = true;
  player.bounciness = 0; 

  spawnNewItem();


}

function draw() {
  drawFloor();
  updateChildren();
  updateItems();

    player.draw();


  if (activeItem) {
    if (player.holding) {
      activeItem.x = player.x;
      activeItem.y = player.y;
    }
    activeItem.draw();
  }


  for (let child of children) {
    child.draw();
  }
  

  
  fill(0);
  textSize(16);
  if (player.holding) {
    text("Find the correct shelf for: " + player.holdingItem.name, 20, 30);
  } else if (activeItem) {
    text("Go pick up the item!", 20, 30);
  } else {
    text("Wait for next item to appear...", 20, 30);
  }

}

function spawnNewItem() {
  if (activeItem) return; // don't spawn if there's already an active item
  

  activeItem = new Sprite(320, 320);
  let randomItemIndex = floor(random(0, ITEMS.length));
  let selectedItem = ITEMS[randomItemIndex];
  
  activeItem.itemType = selectedItem;
  activeItem.name = selectedItem.name;
  activeItem.image = selectedItem.image;
  activeItem.image.scale = 0.7;
  activeItem.collider = 'static';
}



function updateItems() {
  if (activeItem && !player.holding && player.overlaps(activeItem)) {
    player.holding = true;
    player.holdingItem = activeItem.itemType;
    console.log("Picked up: " + activeItem.name);
  }
  
  if (player.holding) {
    for (let i = 0; i < SHELVES.length; i++) {
      let shelf = SHELVES[i];
      
      // Check if player is near this shelf
      if (player.x >= shelf.x && player.x <= shelf.x + shelf.width &&
          player.y >= shelf.y && player.y <= shelf.y + shelf.height) {
        
        // Check if this shelf accepts the held item
        if (shelf.items.includes(player.holdingItem.name)) {
          placeItemOnShelf(shelf);
          break;
        } else {
          fill(255, 0, 0);
          textSize(16);
          text("Wrong shelf!", player.x - 40, player.y - 60);
        }
      }
    }
  }
}


function placeItemOnShelf(shelf) {
  player.holding = false;
  activeItem.remove();
  activeItem = null;
  
  // spawn a new item after a delay
  setTimeout(spawnNewItem, 2000);
}



function updateChildren() {
  if (random() < CHILD_SPAWN_RATE && children.length < MAX_CHILDREN) {
    spawnChild();
  }
  
  for (let i = children.length - 1; i >= 0; i--) {
    let child = children[i];
    
    if (player.overlaps(child)) {
      child.remove();
      children.splice(i, 1);
    }
  }
}

function spawnChild() {
  let child = new Sprite();
  
  let randomImageIndex = floor(random(0,4));
  console.log(randomImageIndex);
  child.image = KIDS[randomImageIndex]; 
  child.image.scale = CHILD_SCALE;
  child.collider = 'static'; 

  
  let validPosition = false;
  let childX, childY;
  
  while (!validPosition) {
    childX = random(50, width - 50);
    childY = random(100, height - 50);
    
    // Check if position overlaps with shelves
    validPosition = true;
    
    if (childX < 300 && childY > 170 && childY < 270) {
      validPosition = false;
    }
    if (childX < 300 && childY > 440 && childY < 620) {
      validPosition = false;
    }

    if (childX > 670 && childX < 820 && childY > 160 && childY < 350) {
      validPosition = false;
    }

    if (childX > 30 && childX < 190 && childY > 700 && childY < 720) {
      validPosition = false;
    }

  }
  
  child.x = childX;
  child.y = childY;
  
  child.velocity.x = 0;
  child.velocity.y = 0;
  
  children.push(child);
}


function mouseClicked() {
  print(mouseX, mouseY);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW || key === 'a') {
    player.velocity.x = -SPEED;
  } else if (keyCode === RIGHT_ARROW || key === 'd') {
    player.velocity.x = SPEED;
  }
  if (keyCode === UP_ARROW || key === 'w') {
    player.velocity.y = -SPEED;
  } else if (keyCode === DOWN_ARROW || key === 's') {
    player.velocity.y = SPEED;
  }
}
    
function keyReleased() {
  if (keyCode === LEFT_ARROW || key === 'a') {
    if (player.velocity.x < 0) player.velocity.x = 0;
  } else if (keyCode === RIGHT_ARROW || key === 'd') {
    if (player.velocity.x > 0) player.velocity.x = 0;
  }
  if (keyCode === UP_ARROW || key === 'w') {
    if (player.velocity.y < 0) player.velocity.y = 0;
  } else if (keyCode === DOWN_ARROW || key === 's') {
    if (player.velocity.y > 0) player.velocity.y = 0;
  }
}





function drawFloor() {
  background(160, 235, 219);
  
  
  strokeWeight(2);
  stroke(0);
  for (let x = 0; x < 900; x += 60) {
    line(x, 0, x, 900);
  }
  for (let y = 0; y < 900; y += 60) {
    line(0, y, 900, y);
  }

  image(shelves1, 0, 170, 300, 100);
  image(shelves2, 0, 440, 300, 100);
  image(checkout, 600, 100, 400, 300);
  image(cardbox, 230, 250, 200, 200);
  image(shelf3, 30, 700, 100, 100);
  image(shelf4, 190, 710, 100, 100);
  
}

