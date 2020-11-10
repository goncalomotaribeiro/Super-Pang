const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

let images = {};
let totalResources = 4;
let numResourcesLoaded = 0;
let fps = 15;

loadImage("player");
loadImage("bg");
loadImage("gun");
loadImage("heart");
loadImage("balloons");

function loadImage(name) {
    images[name] = new Image();
    images[name].src = "images/" + name + ".png";
    images[name].onload = function () {
        resourceLoaded();	//only starts the animation after loading all images			
    };
}

function resourceLoaded() {
    numResourcesLoaded++;
    if (numResourcesLoaded == totalResources) {
        setInterval(render, 1000 / fps); //start animation
    }
}

/*______________________________________________CLASSES______________________________________________________________________*/

class Player {
    constructor(img) {
        this.img = img
        this.swidth = img.width / 8
        this.sheight = img.height / 3
        this.cx = this.swidth * 4 + 4
        this.cy = -2
        this.sx = W / 2
        this.sy = H - img.height - 10;
        this.w = 95
        this.h = 95
    }

    draw() {
        ctx.drawImage(this.img, this.cx, this.cy, this.swidth, this.sheight, this.sx, this.sy, this.w, this.h);
    }

    update(cX, cY) {
        this.cx = cX
        this.cy = cY
    }
}

class Gun {
    constructor(img, sx, sy) {
        this.img = img
        this.sx = sx
        this.sy = sy
        this.w1 = 40
        this.h1 = 490
    }

    draw() {
        ctx.drawImage(this.img, this.sx, this.sy, this.w1, this.h1);
    }

    update(sX, sY) {
        this.sx = sX
        this.sy = sY
    }
}

class Ballon {
    constructor(img, w, h, borderW, borderH, sx, sy, side, collisions) {
        this.img = img
        this.swidth = img.width / 2.65
        this.sheight = img.height / 3
        this.cx = 0
        this.cy = 0
        this.sx = sx
        this.sy = sy
        this.w = w
        this.h = h
        this.angle = -85 * Math.PI / 180
        this.a = 1.3		//acceleration (gravity = 0.1 pixels per frame)
        this.vX = 100 * Math.cos(this.angle) //initial velocity in X
        this.vY = 5 * Math.sin(this.angle) 	//initial velocity in Y
        this.borderW = borderW
        this.borderH = borderH
        this.collisions = collisions
        this.side = side
    }

    draw() {
        ctx.drawImage(this.img, this.cx, this.cy, this.swidth, this.sheight, this.sx, this.sy, this.w, this.h);
    }

    update() {
        if (this.sy > H - this.sheight - this.borderH) {
            this.vY = -this.vY
        }else{
            this.vY += this.a; // increase circle velocity in Y (accelerated motion)
        }
        if (this.sy < 0) {
            this.vY = -this.vY
        }

        if (this.sx > W - this.swidth - this.borderW) {
            this.side = 'left'
        }

        if (this.side == 'left') {
            this.sx -= this.vX; // update circle X position (uniform motion)
        }

        if (this.sx < 0 + 21 ) {
            this.side = 'right'
        }
        if (this.side == 'right') {
            this.sx += this.vX;
        }
        this.sy += this.vY; // update circle Y position 
    }
}

/*______________________________________________RENDER______________________________________________________________________*/

let rightKey = false, leftKey = false, mouseClicked = false;
let frameIndex = 0;
let shoot = 0
let bgY = Math.floor(Math.random() * 20) * 200 + 10;

let player1 = new Player(images["player"])
let gun1 = new Gun(images["gun"], -1000, -1000)

let nCollisions = 0
let ballDistance = 40

let colide = false
let ballon1 = new Ballon(images["balloons"], 100, 100, 60, 80, 20, 100, 'right', 0)
let ballon3
let ballon4
let bArray = new Array();
bArray.push(ballon1)

function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(images["bg"], 10, bgY, 253, 188, 0, 0, W, H);
    if (rightKey && player1.sx < W - 100) {
        player1.update(frameIndex * player1.swidth + 2, player1.sheight * 2)
        player1.sx += 22;
    }
    if (leftKey && player1.sx > 20) {
        player1.update(frameIndex * player1.swidth + 2, - 2)
        player1.sx -= 22;
    }

    if (mouseClicked == true) {
        player1.update(player1.swidth * 5 + 4, 0)
        gun1.update(player1.sx + 13, player1.sy)
        shoot = 1
    }

    if (shoot == 1 && gun1.sy > 10) {
        gun1.draw()
        gun1.update(gun1.sx, gun1.sy - 20)
    } else {
        gun1.update(-1000, -1000)
        shoot = 0
    }

    for (let i = 0; i < bArray.length; i++) {
        const ballon = bArray[i];
        if (ballon.sx + ballon.w - 20 < gun1.sx
            //totally to the left: no collision
            || ballon.sx - ballon.w + ballDistance> gun1.sx
            //totally to the right: no collision
            || ballon.sy + ballon.h - 30 < gun1.sy
            //totally above: no collision
            || ballon.sy > gun1.sy + gun1.h1) {
            //totally below: no collision
        } else {
            shoot = 0
            nCollisions++
            colide = true
            ballon.collisions++
        }
        if(colide == true && ballon.collisions == 1){
            ballDistance = 0
            ballon.side = 'right'
            ballon.w = 50
            ballon.h = 50
            ballon.borderW = 10
            ballon.borderH = 20
            ballon3 = new Ballon(images["balloons"], 50, 50, 10, 20, ballon.sx, ballon.sy, 'left', 1)
            bArray.push(ballon3)
            colide = false
        }
        if(colide == true && ballon.collisions == 2){
            ballon.side = 'right'
            ballon.w = 20
            ballon.h = 20
            ballon.borderW = -10
            ballon.borderH = 0
            ballon4 = new Ballon(images["balloons"], 20, 20, -10, 0, ballon.sx, ballon.sy, 'left', 2)
            bArray.push(ballon4)
            colide = false
        }
        if(colide == true && ballon.collisions >= 3){
            ballon.w = 0
            ballon.h = 0
            ballon.sx = -1000
            ballon.sy = -1000
            colide = false
        }
        ballon.draw()
        ballon.update()
    }
        
    mouseClicked = false

    player1.draw()
    player1.update(player1.swidth * 4 + 4, -2)

    //Vidas do jogador
    ctx.drawImage(images["heart"], 20, 20, 25, 25);
    ctx.drawImage(images["heart"], 47, 20, 25, 25);
    ctx.drawImage(images["heart"], 74, 20, 25, 25);

    frameIndex++;
    if (frameIndex == 4)
        frameIndex = 0;
}

/*______________________________________________EVENTOS RATO E TECLADO______________________________________________________________________*/

function ArrowPressed(e) {
    if (e.keyCode == 68) {
        rightKey = true;
    }
    if (e.keyCode == 65) {
        leftKey = true;
    }
    e.preventDefault()
}

function ArrowReleased(e) {
    if (e.keyCode == 68) {
        rightKey = false;
        player1.cy = -2
    } else if (e.keyCode == 65)
        leftKey = false;
    player1.cx = player1.swidth * 4 + 4
}

function MouseClick(e) {
    playSoundEffects('shoot1.wav')
    mouseClicked = true
}

window.addEventListener('keydown', ArrowPressed);
window.addEventListener('keyup', ArrowReleased);
window.addEventListener('click', MouseClick);

/*______________________________________________AUDIO______________________________________________________________________*/

window.onload = playSoundBackground('track1.mp3')

function playSoundEffects(sound) {
    const audio = new Audio('sounds/' + sound);
    audio.play();
}

function playSoundBackground(sound) {
    const audio = new Audio('sounds/' + sound);
    audio.volume = 0.0;
    audio.play();
}







/*class Enemy {
    constructor(x, y, raio, color, velocidade){
        this.x = x;
        this.y = y;
        this.raio = raio;
           this.color = color;
        this.velocidade = velocidade;
       }

    draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    }

    update(){
    this.draw()
    this.x = this.x + this.velocidade.x
    this.y = this.y + this.velocidade.y
    }
    }
    const enemies = []
    function spawnEnemies(){
    setInterval(() => {
    const raio = Math.random() * (30 - 4) + 4

    let x
    let y

    if (Math.random() < 0.5){
    x = Math.random() < 0.5 ? 0 - raio : canvas.width + raio
    y = Math.random() * canvas.height
    } else{
    x = Math.random() * canvas.width
    y = Math.random() < 0.5 ? 0 - raio : canvas.width + raio
    }

    const color = 'green'

    const angulo = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)
    const velocidade = {
    x: Math.cos(angulo),
    y: Math.sin(angulo)
    }

    enemies.push(new Enemy(x,y, raio, color, velocidade))
    },1000)
    }
spawnEnemies();*/