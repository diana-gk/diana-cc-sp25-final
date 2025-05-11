let gameState;
let player;
let item;
const SPEED = 5;

let NPCS = [];
let KIDS = [];
let ITEMS = [];
let children = []; 
let activeItem = null;

const MAX_CHILDREN = 3; 
const CHILD_SPAWN_RATE = 0.01; 
const CHILD_SCALE = 0.7; 
const CHILD_COUNTDOWN_TIME = 600; // 10 seconds at 60fps
const ANGRY_DURATION = 180; // 3 seconds at 60fps

const BOOSTED_SPEED = 8; 
const SPEED_BOOST_DURATION = 180; // 3 seconds at 60fps
let playerSpeedBoosted = false;
let playerBoostTimer = 0;

const SHELVES = [
  { name: "top shelf", x: 900, y: 50, width: 850, height: 200, items: ["tissues", "waterbottle"] },
  { name: "top shelf2", x: 60, y: 800, width: 850, height: 200, items: ["tissues", "waterbottle"] },
  { name: "middle shelf", x: 1330, y: 50, width: 400, height: 200, items: ["sauce", "bottle"] },
  { name: "middle shelf2", x: 500, y: 800, width: 400, height: 200, items: ["sauce", "bottle"] },
  { name: "bottom shelf", x: 1650, y: 300, width: 300, height: 1000, items: ["corn"] },
  { name: "bottom shelf2", x: 50, y: 220, width: 100, height: 520, items: ["corn"] }

];



let npcs = [];
const NPC_SPEED = 1.5;
const NPC_SPAWN_RATE = 0.005; 
const MAX_NPCS = 5;
const SPAWN_POINT = { x: 350, y: 0 }; 

const CART_OFFSET_X = 50;
const CART_OFFSET_Y = 50;
const CART_SCALE = 0.9;

const COLLISION_DISTANCE = 50; 
const CARDBOARD_BOX = { x: 230, y: 250, width: 200, height: 200 };

let gameFont;

let BackgroundMusic;
let playerImage;
let outlineColor;

let button1;
let button2;


const EXIT_POINT = { x: 870, y: 1320 };

const STORE_BOUNDS = {
  minX: 0,
  maxX: 1800,
  minY: 0,
  maxY: 1020 
};

const CHECKOUT_COUNTERS = [
  { x: 1140, y: 900 }, // Main checkout counter
  { x: 1670, y: 980 }, // Self-checkout 1
  { x: 1440, y: 1500 }, // Self-checkout 2
  { x: 1080, y: 1440 }  // Self-checkout 3
];


const SLOWED_SPEED = 2;
let playerIsSlowed = false;
let playerSlowdownTimer = 0;
const SLOWDOWN_DURATION = 180; // 3 seconds at 60fps


const NPC_PATHS = [
  // Path 1: Enter from door 1, left side shelves, middle area, then checkout
  [
    { x: 280, y: 150 },    // Just inside door 1
    { x: 150, y: 300 },    // Move left to shelves
    { x: 100, y: 400 },    // Browse left shelves
    { x: 100, y: 600 },    // Continue down left side
    { x: 300, y: 750 },    // Move toward middle
    { x: 500, y: 800 },    // Browse middle shelves
    { x: 700, y: 700 },    // Move toward right side
    { x: 900, y: 600 },    // Head toward checkout area
    { x: 960, y: 700 }     // Position before checkout
  ],
  
  // Path 2: Enter from door 1, middle area, top shelves, then to checkout
  [
    { x: 280, y: 150 },    // Just inside door 1
    { x: 400, y: 200 },    // Move right
    { x: 600, y: 150 },    // Browse top area
    { x: 900, y: 100 },    // Continue to top right shelves
    { x: 1200, y: 150 },   // Browse top right shelves
    { x: 1400, y: 300 },   // Move down
    { x: 1300, y: 500 },   // Continue down
    { x: 1100, y: 700 },   // Head toward checkout
    { x: 960, y: 750 }     // Position before checkout
  ],
  
  // Path 3: Enter from door 1, right side, bottom area, then checkout
  [
    { x: 280, y: 150 },    // Just inside door 1
    { x: 400, y: 300 },    // Move down and right
    { x: 650, y: 400 },    // Middle area
    { x: 900, y: 500 },    // Continue right
    { x: 1200, y: 600 },   // Move to right side
    { x: 1500, y: 400 },   // Browse right shelves
    { x: 1300, y: 700 },   // Move down toward checkout
    { x: 1100, y: 800 },   // Head toward checkout
    { x: 960, y: 800 }     // Position before checkout
  ]
];

let camera;
let hudText = "";
const HUD_BOX_WIDTH = 1000;
const HUD_BOX_HEIGHT = 60;
const HUD_MARGIN = 20;
const HUD_CORNER_RADIUS = 10;


let playerMoney = 0;
const WINNING_AMOUNT = 3000; 
const STOCKING_REWARD = 10; // $10 for each item stocked
const SHOPLIFTER_CATCH_REWARD = 25; // $25 for catching a shoplifter
const SHOPLIFTER_ESCAPE_PENALTY = 50; // $50 penalty if a shoplifter escapes

const SHOPLIFTING_CHANCE = 0.3; 
let redFlashAlpha = 0; 
let isAlarmActive = false;
let activeShoplifter = null;


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
  checkout = loadImage("imgs/checkout.png");
  selfcheckout = loadImage("imgs/self-check.png");
  cardbox = loadImage("imgs/cardboard-box.png");
  corn = loadImage("imgs/corn.png");
  sauce = loadImage("imgs/sauce.png");
  waterbottle = loadImage("imgs/waterbottle.png");
  tissues = loadImage("imgs/tissues.png");
  bottle = loadImage("imgs/bottle.png");
  crying = loadImage("imgs/crying.png");
  bag = loadImage("imgs/bag.png");
  doors1 = loadImage("imgs/glassdoors.png");
  doors2 = loadImage("imgs/doors-turned.png")
  parkinglot = loadImage("imgs/parkinglot.jpg")
  car = loadImage("imgs/car.png");
  car2 = loadImage("imgs/car2.png");
  angry = loadImage("imgs/angry.png");


  soundFormats("mp3"); 
  cryingSound = loadSound("assets/crying.mp3");
  bgMusic = loadSound("assets/WiiMusic.mp3");
  alarm = loadSound("assets/alarm.mp3");


  gameFont = loadFont("assets/PressStart2P-Regular.ttf");


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
  createCanvas(1800, 1800);
  drawFloor();
  npcs = [];
  gameState = "intro";

  camera = {
    x: width/2,
    y: height/2,
    zoom: 1
  };

  bgMusic.play();
  bgMusic.loop();
}


function draw() {
    if (gameState == "intro") {
      intro();
    } else if (gameState == "runGame") {
      runGame(playerImage);
    } else if (gameState == "outro") {
      outro();
    }
}

function intro() {
  resetMatrix();

  textSize(40);
  fill(0,0,0);
  textAlign(CENTER, CENTER);
  textFont(gameFont);
  text('grocery store simulator', windowWidth / 2, windowHeight /3);
  textSize(30);
  text('pick an employee', windowWidth/2, windowHeight/3 + 50);
  

  if (!button1) {
  button1 = createImg("imgs/dude.png", "dude");
  button1.position(windowWidth/3 - 50, 3*windowHeight/7 +40);
  button1.size(130, 200);
  button1.mousePressed(function () {
    playerImage = dude;
    button1.remove();
    button2.remove();
    gameState = "runGame";
  });
}

if (!button2) {
  button2 = createImg("imgs/gal.png", "gal");
  button2.position(windowWidth/3 + (windowWidth/5), 3*windowHeight/7 + 35);
  button2.size(130, 200);
  button2.mousePressed(function () {
    playerImage = gal;
    button2.remove();
    button1.remove();
    gameState = "runGame";
  });
}
}


function drawOutline(sprite) {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x == 0 && y == 0) continue; 
      push(); 
      translate(sprite.position.x + x, sprite.position.y + y);  
      fill(outlineColor);
      stroke(outlineColor); 
      strokeWeight(2); 
      ellipse(0, 0, 100, 190); 
      pop(); 
    }
  }
}



function runGame(playerImage) {
  resetMatrix();
 
  if (!player) {
    player = new Sprite(windowWidth/2,windowHeight/2);
    player.image = playerImage;

    if (playerImage == dude) {
      player.image.scale = 0.3;
      outlineColor = color(0,0,255);
    }
    if (playerImage == gal) {
      player.image.scale = 0.2;
      outlineColor = color(255,0,0) ;
    }
    player.collider = 'dynamic';
    player.rotationLock = true;
    player.bounciness = 0; 
  }

  translate(-camera.x + (width/5), -camera.y + (height/5));

  camera.x = lerp(camera.x, player.x, 0.1);
  camera.y = lerp(camera.y, player.y, 0.1);


  drawFloor();
  drawStore();
  updateChildren();
  updateNPCs(); 
  drawShoppingCarts();
  drawBags();
  spawnNewItem();

  if (playerIsSlowed) {
    playerSlowdownTimer--;
    if (playerSlowdownTimer <= 0) {
      playerIsSlowed = false;
    }
  }

  drawOutline(player);

  if (playerSpeedBoosted) {
    push();
    noFill();
    stroke(0, 255, 0); 
    strokeWeight(3);
    ellipse(player.x, player.y, 120, 210);
    pop();
  }

  if (playerIsSlowed) {
    push();
    noFill();
    stroke(255, 0, 0); 
    strokeWeight(3);
    ellipse(player.x, player.y, 120, 210);
    pop();
  }

  player.draw();  
  keepPlayerOnScreen();

  updateItems();



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
  textSize(24);
  textFont('Arial');
  if (player.holding) {
    hudText = "Find the correct shelf for: " + player.holdingItem.name;
  } else if (activeItem) {
    hudText = "Go pick up the item!";
  } else {
    hudText = "Wait for next item to appear...";
  }

  drawHUD();
  textFont(gameFont);
  displayMoney();
  
  if (isAlarmActive) {
    redFlashAlpha = sin(frameCount*2) * 100 + 100; // Make it pulse between 0 and 200 alpha
    push();
    resetMatrix();
    fill(255, 0, 0, redFlashAlpha);
    rect(0, 0, width, height);
    pop();
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
    { x: 0, y: -1 },    // up
    { x: 0.7, y: -0.7 }, // up-right
    { x: 1, y: 0 },     // right
    { x: 0.7, y: 0.7 },  // down-right
    { x: 0, y: 1 },     // down
    { x: -0.7, y: 0.7 }, // down-left
    { x: -1, y: 0 },    // left
    { x: -0.7, y: -0.7 } // up-left
  ];
  
  let validDirections = [];
  
  for (let dir of directions) {
    let testX = npc.x + (dir.x * 60);
    let testY = npc.y + (dir.y * 60);
    
    let hasCollision = false;
    
    // Check NPC collisions
    for (let otherNPC of npcs) {
      if (otherNPC === npc) continue;
      if (dist(testX, testY, otherNPC.x, otherNPC.y) < COLLISION_DISTANCE) {
        hasCollision = true;
        break;
      }
    }
    
    // Check child collisions
    if (!hasCollision) {
      for (let child of children) {
        if (dist(testX, testY, child.x, child.y) < COLLISION_DISTANCE) {
          hasCollision = true;
          break;
        }
      }
    }
    
    // Ensure we stay within bounds
    if (testX < 50 || testX > width - 50 || testY < 50 || testY > height - 50) {
      hasCollision = true;
    }
    
    if (!hasCollision) {
      validDirections.push(dir);
    }
  }
  
  let chosenDirection;
  
  if (validDirections.length > 0) {
    // Choose a random valid direction
    chosenDirection = random(validDirections);
  } else {
    // If no valid directions, just wait
    npc.pauseTimer = 30;
    return;
  }
  
  // Set temp target 60 pixels away in the chosen direction
  let tempTargetX = npc.x + (chosenDirection.x * 60);
  let tempTargetY = npc.y + (chosenDirection.y * 60);
  
  // Make sure the target stays within canvas
  tempTargetX = constrain(tempTargetX, 50, width - 50);
  tempTargetY = constrain(tempTargetY, 50, height - 50);
  
  // Set as temp target
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

  for (let npc of npcs) {
    if (dist(SPAWN_POINT.x, SPAWN_POINT.y, npc.x, npc.y) < 150) {
      return; // Don't spawn if another NPC is near the entrance
    }
  }

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
  npc.useMainCheckout = random() < 0.4; // 40% use main checkout, 60% use self-checkout
  npc.hasCart = true; 
  npc.cartFull = false; 
  npc.hasBag = false;
  npc.browseCounter = 0; 
  npc.browseThreshold = floor(random(60, 180)); // Longer browsing time
  npc.bounciness = 2;
  npc.pathIndex = 0; // For tracking path progress
  npc.isAngry = false;
  npc.angryTimer = 0;
  
  npc.isFollowingTempTarget = false;
  npc.tempTargetX = null;
  npc.tempTargetY = null;

  npc.willShoplift = random() < SHOPLIFTING_CHANCE;
  npc.isShoplifting = false;
  npc.isFleeing = false;

  // Assign a random path to the NPC
  let randomPathIndex = floor(random(0, NPC_PATHS.length));
  npc.path = NPC_PATHS[randomPathIndex];
  
  // Add a slight random variation to each waypoint to prevent NPCs on the same path from clustering
  for (let i = 0; i < npc.path.length; i++) {
    npc.path[i] = {
      x: npc.path[i].x + random(-30, 30),
      y: npc.path[i].y + random(-30, 30)
    };
  }
  
  // Ensure paths don't go off-screen
  for (let i = 0; i < npc.path.length; i++) {
    npc.path[i].x = constrain(npc.path[i].x, 50, width - 50);
    npc.path[i].y = constrain(npc.path[i].y, 50, height - 50);
  }
  
  // Randomly select a checkout counter
  if (npc.useMainCheckout) {
    npc.checkoutCounter = CHECKOUT_COUNTERS[0]; // Main checkout
  } else {
    // Select a random self-checkout (index 1-3)
    npc.checkoutCounter = CHECKOUT_COUNTERS[floor(random(1, CHECKOUT_COUNTERS.length))];
  }
  
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
          npc.state = 'checkout'; // Move to checkout once cart is full
          npc.targetX = npc.checkoutCounter.x;
          npc.targetY = npc.checkoutCounter.y;
        }
      }
      
      continue;
    }
    
    // Check if following temporary path from collision avoidance
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

      // Check for another collision
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
    
    // Check for collisions and find an alternative path if needed
    if (checkNPCCollisions(npc, nextX, nextY, i) || 
        checkChildrenCollisions(npc, nextX, nextY)) {
      findAlternativePath(npc);
      npc.pauseTimer = 15;
      npc.draw();
      continue;
    }
    
    // NPC state machine
    switch (npc.state) {
      case 'entering':
      case 'browsing':
        // For both entering and browsing states, follow the path waypoints
        if (npc.pathIndex < npc.path.length) {
          let currentTarget = npc.path[npc.pathIndex];
          
          // Calculate distance to target
          let distToTarget = dist(npc.x, npc.y, currentTarget.x, currentTarget.y);
          
          if (distToTarget > 10) {
            // Move toward the target
            let angleToTarget = atan2(currentTarget.y - npc.y, currentTarget.x - npc.x);
            npc.velocity.x = cos(angleToTarget) * NPC_SPEED;
            npc.velocity.y = sin(angleToTarget) * NPC_SPEED;
          } else {
            // Reached current target
            npc.velocity.x = 0;
            npc.velocity.y = 0;
            npc.pathIndex++;
            
            // Pause at each waypoint to simulate browsing
            npc.pauseTimer = floor(random(30, 90));
            
            // If reached the end of the path
            if (npc.pathIndex >= npc.path.length) {
              if (npc.state === 'entering') {
                // If just finished the "entering" state, switch to browsing
                npc.state = 'browsing';
                // Reset path index for browsing again
                npc.pathIndex = 0;
              } else {
                // If finished browsing, switch to checkout
                npc.cartFull = true;
                npc.state = 'checkout';
                npc.targetX = npc.checkoutCounter.x;
                npc.targetY = npc.checkoutCounter.y;
              }
            }
          }
        }
        break;
        
        case 'checkout':
          // Move to the assigned checkout counter
          if (npc.targetX !== null && npc.targetY !== null) {
            let distToCheckout = dist(npc.x, npc.y, npc.targetX, npc.targetY);
            
            if (distToCheckout > 10) {
              // Move toward the checkout
              let angleToCheckout = atan2(npc.targetY - npc.y, npc.targetX - npc.x);
              npc.velocity.x = cos(angleToCheckout) * NPC_SPEED;
              npc.velocity.y = sin(angleToCheckout) * NPC_SPEED;
            } else {
              npc.velocity.x = 0;
              npc.velocity.y = 0;
              
              if (npc.willShoplift && !isAlarmActive && !npc.isShoplifting) {
                npc.isShoplifting = true;
                activeShoplifter = npc;
                triggerShoplifterAlarm();
                
                // Skip checkout and head straight to exit
                npc.pauseTimer = 0; 
                npc.state = 'exiting';
                npc.isFleeing = true;
                npc.hasCart = false;
                npc.hasBag = true;
                npc.targetX = EXIT_POINT.x;
                npc.targetY = EXIT_POINT.y;
              } else {
                // Normal checkout process
                npc.pauseTimer = 180; // Time at checkout
                
                npc.state = 'exiting';
                npc.hasCart = false; 
                npc.hasBag = true;   
                npc.targetX = EXIT_POINT.x;
                npc.targetY = EXIT_POINT.y;
              }
            }
          }
          break;
          
        case 'exiting':
          // First move to the exit doors
          let distToExit = dist(npc.x, npc.y, EXIT_POINT.x, EXIT_POINT.y);
          
          if (distToExit > 10) {
            // Move toward the exit
            let angleToExit = atan2(EXIT_POINT.y - npc.y, EXIT_POINT.x - npc.x);
            let fleeingSpeed = npc.isFleeing ? NPC_SPEED * 1.5 : NPC_SPEED;
            npc.velocity.x = cos(angleToExit) * fleeingSpeed;
            npc.velocity.y = sin(angleToExit) * fleeingSpeed;
          } else {
            // After reaching exit doors, head left off screen
            npc.targetX = -100;
            npc.targetY = EXIT_POINT.y;
            npc.state = 'leaving';
          }
          break;
          
        case 'leaving':
          // Move left until off screen
          let fleeingLeaveSpeed = npc.isFleeing ? NPC_SPEED * 1.5 : NPC_SPEED;
          npc.velocity.x = -fleeingLeaveSpeed;
          npc.velocity.y = 0;
          
          // Remove when off screen
          if (npc.x < -50) {
            // If this was a shoplifter that escaped
            if (npc.isShoplifting) {
              handleShoplifterEscaped();
            }
            
            npc.remove();
            npcs.splice(i, 1);
          }
          break;
        }

        //if a npc is shoplifting, catching them will grant a speed boost
    if (player.overlaps(npc) && npc.isShoplifting) {
      npc.isAngry = true;
      npc.angryTimer = ANGRY_DURATION;
      
      playerSpeedBoosted = true;
      playerBoostTimer = SPEED_BOOST_DURATION;
      
      //Small bounce effect
      let angle = atan2(player.y - npc.y, player.x - npc.x);
      player.velocity.x = cos(angle) * 3;
      player.velocity.y = sin(angle) * 3;
    }    

//if a npc is not shoplifitng, bumping them will slow you down
    if (player.overlaps(npc) && !npc.isAngry) {
      npc.isAngry = true;
      npc.angryTimer = ANGRY_DURATION;
      
      playerIsSlowed = true;
      playerSlowdownTimer = SLOWDOWN_DURATION;
      
      // Small bounce effect
      let angle = atan2(player.y - npc.y, player.x - npc.x);
      player.velocity.x = cos(angle) * 3;
      player.velocity.y = sin(angle) * 3;
    }
    
    if (npc.isAngry) {
      npc.angryTimer--;
      if (npc.angryTimer <= 0) {
        npc.isAngry = false;
      }
    }
    
    npc.draw();

    if (npc.isAngry) {
      push(); 
      imageMode(CENTER);
      image(angry, npc.x, npc.y - 60, 75, 75); 
      pop();
    }

    if (npc.isShoplifting && player.overlaps(npc)) {
      handleShoplifterCaught(npc);
      npc.isShoplifting = false;
      npc.isFleeing = false;
      
      npc.isAngry = true;
      npc.angryTimer = ANGRY_DURATION * 2; 
      
      npc.remove();
      npcs.splice(i, 1);
    }
    
    // If NPC is shoplifting, draw a special indicator
    if (npc.isShoplifting) {
      push(); 
      fill(255, 0, 0);
      noStroke();
      ellipse(npc.x, npc.y - 100, 15, 15); // Red dot above shoplifter
      pop();
    }
  }
}


function spawnNewItem() {
  if (activeItem) return; // don't spawn if there's already an active item
  
  activeItem = new Sprite(760, 160);
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
  
  playerMoney += STOCKING_REWARD;
  
  showMoneyNotification(STOCKING_REWARD, true);
  
  if (playerMoney >= WINNING_AMOUNT) {
    gameState = "outro";
  } else {
    setTimeout(spawnNewItem, 2000);
  }
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
      cryingSound.loop();
    }
    
    if (player.overlaps(child)) {
      playerSpeedBoosted = true;
      playerBoostTimer = SPEED_BOOST_DURATION;
      
      if (child.isCrying) {
        cryingSound.stop();
      }
      
      child.remove();
      children.splice(i, 1);
    }
  }
  
  if (playerSpeedBoosted) {
    playerBoostTimer--;
    if (playerBoostTimer <= 0) {
      playerSpeedBoosted = false;
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
    // Only spawn within store bounds (not in parking lot)
    childX = random(STORE_BOUNDS.minX + 50, STORE_BOUNDS.maxX - 50);
    childY = random(STORE_BOUNDS.minY + 100, STORE_BOUNDS.maxY - 50);
    
    // Check if position overlaps with shelves
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
    
    // Don't spawn by the box
    if (childX > CARDBOARD_BOX.x - COLLISION_DISTANCE && 
        childX < CARDBOARD_BOX.x + CARDBOARD_BOX.width + COLLISION_DISTANCE &&
        childY > CARDBOARD_BOX.y - COLLISION_DISTANCE && 
        childY < CARDBOARD_BOX.y + CARDBOARD_BOX.height + COLLISION_DISTANCE) {
      validPosition = false;
    }
    
    // Don't spawn by another child
    for (let existingChild of children) {
      if (dist(childX, childY, existingChild.x, existingChild.y) < COLLISION_DISTANCE) {
        validPosition = false;
        break;
      }
    }
    
    // Don't spawn near npcs
    for (let npc of npcs) {
      if (dist(childX, childY, npc.x, npc.y) < COLLISION_DISTANCE) {
        validPosition = false;
        break;
      }
    }

    // Don't spawn on player
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
  let currentSpeed = SPEED;
  
  if (playerSpeedBoosted) {
    currentSpeed = BOOSTED_SPEED;
  } else if (playerIsSlowed) {
    currentSpeed = SLOWED_SPEED;
  }
  
  if (key === 'A' || key === 'a') {
    player.velocity.x = -currentSpeed;
  } else if (key === 'D' || key === 'd') {
    player.velocity.x = currentSpeed;
  }
  if (key === 'W' || key === 'w') {
    player.velocity.y = -currentSpeed;
  } else if (key === 'S' || key === 's') {
    player.velocity.y = currentSpeed;
  }
}

    
function keyReleased() {
  if (key === 'A' || key === 'a') {
    if (player.velocity.x < 0) player.velocity.x = 0;
  } else if (key === 'D'|| key === 'd') {
    if (player.velocity.x > 0) player.velocity.x = 0;
  }
  if (key === 'W' || key === 'w') {
    if (player.velocity.y < 0) player.velocity.y = 0;
  } else if (key === 'S' || key === 's') {
    if (player.velocity.y > 0) player.velocity.y = 0;
  }
}

function drawFloor() {
  background(0,0,0);

  bgColor = color(160, 235, 219);
  fill(bgColor);
  rect(0,0,1800,1800);

  
  strokeWeight(2);
  stroke(0);
  for (let x = 0; x < 1800; x += 60) {
    line(x, 0, x, 1800);
  }
  for (let y = 0; y < 1800; y += 60) {
    line(0, y, 1800, y);
  }
}

function drawStore() {

  image(doors1, 180, 0, 200, 200);
  image(doors1, 380, 0, 200, 200);


  image(shelf3, 50, 220, 100, 100); 
  image(shelf3, 50, 360, 100, 100); 
  image(shelf4, 50, 520, 100, 100);
  image(shelf4, 50, 650, 100, 100);
  image(shelf3, 1650, 620, 100, 100); 


  image(shelves1, 60, 800, 400, 200); 
  image(shelves2, 500, 800, 400, 200);

  image(shelves1, 900, 40, 400, 200); 
  image(shelves2, 1340, 40, 400, 200);



  image(checkout, 960, 800, 200, 250);


  image(cardbox, 620, 50, 200, 200);
  image(cardbox, 720, 50, 200, 200);
  image(cardbox, 670, 80, 200, 200);



  image(shelf3, 1650, 290, 100, 100); 
  image(shelf4, 1650, 450, 100, 100);

  //wall
  fill(125, 0, 0);
  rect(0, 1020, 900, 60);
  rect(840, 1020, 60, 780);

  image(doors2, 840, 1320, 60, 300);
  image(parkinglot, 0, 1080, 840, 720);

  image(car, 460, 1130, 170, 200);
  image(car2, 340, 1560, 170, 200);

  
  image(selfcheckout, 1620, 700, 180, 400);
  image(selfcheckout, 1620, 1000, 180, 400);
  image(selfcheckout, 1620, 1300, 180, 400);

  image(selfcheckout, 950, 1400, 180, 400);
  image(selfcheckout, 1100, 1400, 180, 400);
  image(selfcheckout, 1250, 1400, 180, 400);
  image(selfcheckout, 1400, 1400, 180, 400);
  image(selfcheckout, 1550, 1400, 180, 400);

}


function keepPlayerOnScreen() {
  const margin = 20;
  
  if (player.x < margin) {
    player.x = margin;
    player.velocity.x = 0;
  } else if (player.x > width - margin) {
    player.x = width - margin;
    player.velocity.x = 0;
  }
  
  if (player.y < margin) {
    player.y = margin;
    player.velocity.y = 0;
  } else if (player.y > height - margin) {
    player.y = height - margin;
    player.velocity.y = 0;
  }
}

function drawHUD() {
  push(); 
  
  // Reset the transformation to draw HUD in screen coordinates
  resetMatrix();
  
  let hudX = (windowWidth/3) - (HUD_BOX_WIDTH/4);
  let hudY = HUD_MARGIN;
  
  fill(0, 0, 0, 200); 
  stroke(255);
  strokeWeight(2);
  rectMode(CORNER);
  rect(hudX, hudY, HUD_BOX_WIDTH, HUD_BOX_HEIGHT, HUD_CORNER_RADIUS);
  
  fill(255);
  noStroke();
  textSize(20);
  textFont(gameFont);
  textAlign(CENTER, CENTER);
  
  let displayText = hudText;
  
  if (playerSpeedBoosted) {
    displayText += " [SPEED BOOST!]";
  } else if (playerIsSlowed) {
    displayText += " [SLOWED!]";
  }
  
  text(displayText, hudX + HUD_BOX_WIDTH/2, hudY + HUD_BOX_HEIGHT/2);
  
  pop();
}


function displayMoney() {
  push();
  resetMatrix();
  
  let moneyX = (windowWidth/3) - (HUD_BOX_WIDTH/4);
  let moneyY = HUD_MARGIN + HUD_BOX_HEIGHT + 10;
  
  //money display
  fill(0, 0, 0, 200);
  stroke(255, 215, 0); 
  strokeWeight(2);
  rectMode(CORNER);
  rect(moneyX, moneyY, HUD_BOX_WIDTH, HUD_BOX_HEIGHT, HUD_CORNER_RADIUS);
  
  fill(255, 215, 0); 
  noStroke();
  textSize(24);
  textAlign(CENTER, CENTER);
  text("$" + playerMoney, moneyX + HUD_BOX_WIDTH/2, moneyY + HUD_BOX_HEIGHT/2);
  
  pop();
}


function showMoneyNotification(amount, isGain) {
  let notification = {
    amount: amount,
    isGain: isGain,
    x: player.x,
    y: player.y - 70,
    alpha: 255,
    lifetime: 60 // 1 second at 60fps
  };
  
  let notificationInterval = setInterval(() => {
    push();
    textAlign(CENTER);
    translate(-camera.x + (width/5), -camera.y + (height/5));
    
    if (notification.isGain) {
      fill(0, 255, 0, notification.alpha);
    } else {
      fill(255, 0, 0, notification.alpha);
    }
    
    textSize(24);
    text((notification.isGain ? "+" : "-") + "$" + notification.amount, notification.x, notification.y);
    
    pop();
    
    notification.y -= 1;
    notification.alpha -= 5;
    
    if (notification.alpha <= 0) {
      clearInterval(notificationInterval);
    }
  }, 16); // Roughly 60fps
}

function triggerShoplifterAlarm() {
  isAlarmActive = true;
  alarm.loop();
}

function stopAlarm() {
  isAlarmActive = false;
  alarm.stop();
  activeShoplifter = null;
}

function handleShoplifterCaught(shoplifter) {
  playerMoney += SHOPLIFTER_CATCH_REWARD;
  showMoneyNotification(SHOPLIFTER_CATCH_REWARD, true);
  stopAlarm();
  
  if (playerMoney >= WINNING_AMOUNT) {
    gameState = "outro";
  }
}

function handleShoplifterEscaped() {
  playerMoney -= SHOPLIFTER_ESCAPE_PENALTY;
  showMoneyNotification(SHOPLIFTER_ESCAPE_PENALTY, false);
  stopAlarm();
}

function outro() {
  resetMatrix();
  
  background(0, 0, 0, 100);
  
  fill(0, 0, 0, 200);
  rectMode(CORNER);
  rect(0, 0, width, height);
  
  textFont(gameFont);
  textSize(40);
  fill(255, 215, 0); 
  textAlign(CENTER, CENTER);
  text("YOU'VE EARNED ENOUGH", width / 2, height / 3);
  
  textSize(60);
  fill(255, 255, 255);
  text("NOW GO HOME...", width / 2, height / 2);
  
  textSize(30);
  fill(0, 255, 0);
  text("FINAL EARNINGS: $" + playerMoney, width / 2, height * 2/3);
  
  textSize(20);
  fill(150, 150, 150);
  text("REFRESH PAGE TO PLAY AGAIN", width / 2, height * 3/4);
}