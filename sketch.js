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
const CHILD_COUNTDOWN_TIME = 600; // 10 seconds at 60fps

const SHELVES = [
  { name: "top shelf", x: 0, y: 100, width: 300, height: 100, items: ["tissues", "sauce"] },
  { name: "middle shelf", x: 0, y: 440, width: 300, height: 100, items: ["waterbottle", "bottle"] },
  { name: "bottom shelf", x: 30, y: 780, width: 300, height: 100, items: ["corn"] }
];


let npcs = [];
const NPC_SPEED = 1.5;
const NPC_SPAWN_RATE = 0.005; 
const MAX_NPCS = 5;
const SPAWN_POINT = { x: 450, y: 0 }; 

const CART_OFFSET_X = 50;
const CART_OFFSET_Y = 50;
const CART_SCALE = 0.9;

const COLLISION_DISTANCE = 50; 
const CARDBOARD_BOX = { x: 230, y: 250, width: 200, height: 200 };


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
  crying = loadImage("imgs/crying.png");
  bag = loadImage("imgs/bag.png")

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

  npcs = [];
}

function draw() {
  drawFloor();
  updateChildren();
  updateItems();
  updateNPCs(); 
  drawShoppingCarts();
  drawBags();


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
    
    if (!child.isCrying) {
      let progressWidth = map(child.countdown, 0, CHILD_COUNTDOWN_TIME, 0, 50);
      
      //progress bar
      fill(255, 0, 0);
      noStroke();
      rect(child.x - 25, child.y - 60, 50, 10);
      
      fill(0, 255, 0);
      rect(child.x - 25, child.y - 60, progressWidth, 10);
    }
    
    if (child.isCrying) {
      push(); 
      imageMode(CENTER);
      image(crying, child.x, child.y - 40, 75, 75); 
      pop();
    }
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


function checkNPCCollisions(currentNPC, nextX, nextY, currentIndex) {
  for (let i = 0; i < npcs.length; i++) {
    if (i === currentIndex) continue; // skip self
    
    let otherNPC = npcs[i];
    let distance = dist(nextX, nextY, otherNPC.x, otherNPC.y);
    
    if (distance < COLLISION_DISTANCE) {
      return true; // collision detected
    }
  }
  
  return false; // no collision
}


function checkChildrenCollisions(npc, nextX, nextY) {
  for (let child of children) {
    let distance = dist(nextX, nextY, child.x, child.y);
    
    if (distance < COLLISION_DISTANCE) {
      return true; 
    }
  }
  
  return false; 
}


function findAlternativePath(npc) {
  let directions = [
    { x: 0, y: -1 },  // up
    { x: 1, y: 0 },   // right
    { x: 0, y: 1 },   // down
    { x: -1, y: 0 }   // left
  ];
  
  let randomDirection = random(directions);
  
  // set temp target 50 pixels away
  let tempTargetX = npc.x + (randomDirection.x * 50);
  let tempTargetY = npc.y + (randomDirection.y * 50);
  
  // make sure the target stays within  canvas
  if (tempTargetX < 50) tempTargetX = 50;
  if (tempTargetX > width - 50) tempTargetX = width - 50;
  if (tempTargetY < 50) tempTargetY = 50;
  if (tempTargetY > height - 50) tempTargetY = height - 50;
  
  // set as temp target
  npc.tempTargetX = tempTargetX;
  npc.tempTargetY = tempTargetY;
  npc.isFollowingTempTarget = true;
}


function drawShoppingCarts() {
  for (let npc of npcs) {
    if (npc.hasCart) {
      push();
      imageMode(CENTER);
      
      let cartX = npc.x - CART_OFFSET_X;
      let cartY = npc.y + CART_OFFSET_Y;
      
      let cartImage = npc.cartFull ? shoppingCartFull : shoppingCart;
      image(cartImage, cartX, cartY, cartImage.width * CART_SCALE, cartImage.height * CART_SCALE);
      
      pop();
    }
  }
}

function drawBags() {
  for (let npc of npcs) {
    
      push();
      imageMode(CENTER);
      
      let bagX = npc.x - CART_OFFSET_X;
      let bagY = npc.y + CART_OFFSET_Y;
      
      if (npc.hasBag) {
      image(bag, bagX, bagY, bag.width * 0.3, bag.height * 0.3);
      }
      pop();
  }
}

function spawnNPC() {
  if (npcs.length >= MAX_NPCS) return;
  
  let npc = new Sprite(SPAWN_POINT.x, SPAWN_POINT.y);
  let randomNPCIndex = floor(random(0, NPCS.length));
  npc.image = NPCS[randomNPCIndex];
  npc.image.scale = 0.7;
  npc.collider = 'dynamic';
  npc.rotationLock = true;
  
  npc.state = 'entering';
  npc.targetX = null;
  npc.targetY = null;
  npc.pauseTimer = 0;
  npc.browsingTime = floor(random(180, 480));
  npc.isCheckout = random() < 0.7;
  npc.hasCart = true; 
  npc.cartFull = false; 
  npc.hasBag = false;
  npc.browseCounter = 0; 
  npc.browseThreshold = floor(random(1, 60)); 
  npc.bounciness = 2;
  
  npc.isFollowingTempTarget = false;
  npc.tempTargetX = null;
  npc.tempTargetY = null;

  npc.browsingSpots = [
    { x: 150, y: 300 },
    { x: 150, y: 570 },
    { x: 150, y: 750 },
    { x: 400, y: 300 },
    { x: 400, y: 570 },
    { x: 600, y: 450 }
  ];
  
  npc.targetY = 200;
  
  npcs.push(npc);
}

function updateNPCs() {
  if (random() < NPC_SPAWN_RATE && npcs.length < MAX_NPCS) {
    spawnNPC();
  }
  
  for (let i = npcs.length - 1; i >= 0; i--) {
    let npc = npcs[i];
    
    if (npc.pauseTimer > 0) {
      npc.pauseTimer--;
      npc.velocity.x = 0;
      npc.velocity.y = 0;
      
      if (npc.state === 'browsing' && !npc.cartFull) {
        npc.browseCounter++;
        
        if (npc.browseCounter >= npc.browseThreshold) {
          npc.cartFull = true;
        }
      }
      
      continue;
    }
    
    // check if following temporary path from collision avoidance
    if (npc.isFollowingTempTarget) {
      if (abs(npc.x - npc.tempTargetX) > 5) {
        npc.velocity.x = npc.x < npc.tempTargetX ? NPC_SPEED : -NPC_SPEED;
        npc.velocity.y = 0;
      } else if (abs(npc.y - npc.tempTargetY) > 5) {
        npc.velocity.y = npc.y < npc.tempTargetY ? NPC_SPEED : -NPC_SPEED;
        npc.velocity.x = 0;
      } else {
        npc.isFollowingTempTarget = false;
      }
      
      let nextX = npc.x + npc.velocity.x;
      let nextY = npc.y + npc.velocity.y;

      //check for another collision
      if (checkNPCCollisions(npc, nextX, nextY, i) || 
          checkChildrenCollisions(npc, nextX, nextY)) {
        findAlternativePath(npc);
        npc.pauseTimer = 15;
      }
      
      npc.draw();
      continue;
    }
    
    let nextX = npc.x + npc.velocity.x;
    let nextY = npc.y + npc.velocity.y;
    
    if (checkNPCCollisions(npc, nextX, nextY, i) || 
        checkChildrenCollisions(npc, nextX, nextY)) {
      findAlternativePath(npc);
      npc.pauseTimer = 15;
      npc.draw();
      continue;
    }
    
    //npc state machine
    switch (npc.state) {
      case 'entering':
        if (npc.targetY !== null && abs(npc.y - npc.targetY) > 5) {
          npc.velocity.y = NPC_SPEED;
          npc.velocity.x = 0;
        } else {
          npc.state = 'browsing';
          let spot = random(npc.browsingSpots);
          npc.targetX = spot.x;
          npc.targetY = spot.y;
          npc.pauseTimer = 30; 
        }
        break;
        
      case 'browsing':
        if (npc.targetX !== null && abs(npc.x - npc.targetX) > 5) {
          npc.velocity.x = npc.x < npc.targetX ? NPC_SPEED : -NPC_SPEED;
          npc.velocity.y = 0;
        } else if (npc.targetY !== null && abs(npc.y - npc.targetY) > 5) {
          npc.velocity.y = npc.y < npc.targetY ? NPC_SPEED : -NPC_SPEED;
          npc.velocity.x = 0;
        } else {
          npc.velocity.x = 0;
          npc.velocity.y = 0;
          npc.pauseTimer = npc.browsingTime;
          
          if (npc.isCheckout) {
            npc.state = 'checkout';
            npc.targetX = 700;
            npc.targetY = 200; 
          } else {
            npc.state = 'leaving';
            npc.targetX = SPAWN_POINT.x;
            npc.targetY = SPAWN_POINT.y;
          }
        }
        break;
        
      case 'checkout':
        if (npc.targetX !== null && abs(npc.x - npc.targetX) > 5) {
          npc.velocity.x = npc.x < npc.targetX ? NPC_SPEED : -NPC_SPEED;
          npc.velocity.y = 0;
        } else if (npc.targetY !== null && abs(npc.y - npc.targetY) > 5) {
          npc.velocity.y = npc.y < npc.targetY ? NPC_SPEED : -NPC_SPEED;
          npc.velocity.x = 0;
        } else {
          npc.velocity.x = 0;
          npc.velocity.y = 0;
          npc.pauseTimer = 180;
          
          npc.state = 'leaving';
          npc.hasCart = false;
          npc.hasBag = true;
          npc.targetX = SPAWN_POINT.x;
          npc.targetY = SPAWN_POINT.y;
        }
        break;
        
      case 'leaving':
        if (npc.targetY !== null && abs(npc.y - npc.targetY) > 5) {
          npc.velocity.y = npc.y < npc.targetY ? NPC_SPEED : -NPC_SPEED;
          npc.velocity.x = 0;
        } else if (npc.targetX !== null && abs(npc.x - npc.targetX) > 5) {
          npc.velocity.x = npc.x < npc.targetX ? NPC_SPEED : -NPC_SPEED;
          npc.velocity.y = 0;
        } else {
          npc.remove();
          npcs.splice(i, 1);
        }
        break;
    }
    
    npc.draw();
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
      
      // check if player is near this shelf
      if (player.x >= shelf.x && player.x <= shelf.x + shelf.width &&
          player.y >= shelf.y && player.y <= shelf.y + shelf.height) {
        
        // check if this shelf accepts the held item
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
    
    child.countdown--;
    
    if (child.countdown <= 0 && !child.isCrying) {
      child.isCrying = true;
    }
    
    if (player.overlaps(child)) {
      child.remove();
      children.splice(i, 1);
    }
  }
}

function spawnChild() {
  let child = new Sprite();
  
  let randomImageIndex = floor(random(0,4));
  child.image = KIDS[randomImageIndex]; 
  child.image.scale = CHILD_SCALE;
  child.collider = 'static'; 
  
  child.countdown = CHILD_COUNTDOWN_TIME;
  child.isCrying = false;
  
  let validPosition = false;
  let childX, childY;
  
  while (!validPosition) {
    childX = random(50, width - 50);
    childY = random(100, height - 50);
    
    // check if position overlaps with shelves
    validPosition = true;
    
    if (childX < 300 && childY > 100 && childY < 200) { 
      validPosition = false;
    }
    if (childX < 300 && childY > 440 && childY < 620) {
      validPosition = false;
    }
    if (childX > 670 && childX < 820 && childY > 160 && childY < 350) {
      validPosition = false;
    }
    if (childX > 30 && childX < 190 && childY > 780 && childY < 880) { 
      validPosition = false;
    }
    
    //dont spawn by the box
    if (childX > CARDBOARD_BOX.x - COLLISION_DISTANCE && 
        childX < CARDBOARD_BOX.x + CARDBOARD_BOX.width + COLLISION_DISTANCE &&
        childY > CARDBOARD_BOX.y - COLLISION_DISTANCE && 
        childY < CARDBOARD_BOX.y + CARDBOARD_BOX.height + COLLISION_DISTANCE) {
      validPosition = false;
    }
    
    //dont spawn by another child
    for (let existingChild of children) {
      if (dist(childX, childY, existingChild.x, existingChild.y) < COLLISION_DISTANCE) {
        validPosition = false;
        break;
      }
    }
    
    //dont spawn near npcs
    for (let npc of npcs) {
      if (dist(childX, childY, npc.x, npc.y) < COLLISION_DISTANCE) {
        validPosition = false;
        break;
      }
    }

    //dont spawn on player
    if (dist(childX, childY, player.x, player.y) < COLLISION_DISTANCE) {
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

  image(shelves1, 0, 100, 300, 100); 
  image(shelves2, 0, 440, 300, 100);
  image(checkout, 600, 100, 400, 300);
  image(cardbox, 230, 250, 200, 200);
  image(shelf3, 30, 780, 100, 100); 
  image(shelf4, 190, 790, 100, 100);
}