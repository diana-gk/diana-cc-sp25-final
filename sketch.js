let player;
var dude;
const SPEED = 3;


let NPCS = [];
let KIDS = [];
let children = []; 

const MAX_CHILDREN = 3; 
const CHILD_SPAWN_RATE = 0.01; 
const CHILD_SCALE = 0.7; 


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
  checkout = loadImage("imgs/checkout-counter.png")

  NPCS = [person1, person2, person3, person4, person5, person6, person7, person8, person9];
  KIDS = [child1, child2, child3, child4];
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

}

function draw() {
  drawFloor();
  updateChildren();

  

  for (let child of children) {
    child.draw();
  }
  
  player.draw();

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
    if (childX < 300 && childY > 520 && childY < 620) {
      validPosition = false;
    }

    if (childX > 670 && childX < 820 && childY > 160 && childY < 350) {
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
  image(shelves2, 0, 520, 300, 100);
  image(checkout, 600, 100, 400, 300)
  
}