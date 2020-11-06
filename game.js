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
    constructor(img) {
        this.img = img
        this.swidth = img.width / 2.65
        this.sheight = img.height / 3
        this.cx = 0
        this.cy = 0
        this.sx = 20
        this.sy = 100
        this.w = 100
        this.h = 100
        this.angle = -85 * Math.PI / 180
        this.a = 1.3		//acceleration (gravity = 0.1 pixels per frame)
        this.vX = 60 * Math.cos(this.angle) //initial velocity in X
        this.vY = 5 * Math.sin(this.angle) 	//initial velocity in Y
    }

    draw() {
        ctx.drawImage(this.img, this.cx, this.cy, this.swidth, this.sheight, this.sx, this.sy, this.w, this.h);
    }

    update(sX, sY) {
        if (this.sy > H - this.sheight - 80) {
            this.vY = -this.vY
        }else{
            this.vY += this.a; // increase circle velocity in Y (accelerated motion)
        }
        if (this.sy < 0) {
            this.vY = -this.vY
        }

        if (this.sx > W - this.swidth - 60) {
            this.wall = 1
        }

        if (this.wall == 1) {
            this.sx -= this.vX; // update circle X position (uniform motion)
        }
        if (this.sx < 0 + 21) {
            this.wall = 0
        }

        if (this.wall == 0) {
            this.sx += this.vX; // update circle X position (uniform motion)
        }
        this.sy += this.vY; // update circle Y position 
    }
}


let gravidade = 0.2

//definição das bolas
class Ball {
    constructor(x, y, r, d, c, v) {	// CONSTRUCTOR
        this.x = x; // initial X position
        this.y = y;	// initial Y position
        this.dX = v * Math.cos(d);  //deslocamento horizontal
        this.dY = v * Math.sin(d);  //deslocamento vertical
        this.c = c; // cor
        this.R = r; // raio
    }

    draw() {
        ctx.fillStyle = this.c;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.R, 0, 2 * Math.PI);
        ctx.fill();
    }
    update() {
        // Colisão com as "bordas" do bg
        if (this.x < this.R * 2 || this.x > W - this.R * 2)
            this.dX = -this.dX;
            
        if (this.y < this.R * 2 || this.y > H - this.R * 2)
            this.dY = -this.dY;
        this.x += this.dX;	// update horizontal position 
        this.y += this.dY;	// update vertical position 
    }
}

let b = new Array(); // setup as many balls as wanted
for (let i = 0; i < 1; i++) {

    let color = '#8B0000'; // random color

    // random direction
    let direction = Math.random() * 2 * Math.PI;

    let raio = 20

    // random position (inside Canvas)
    let xInit = 2 * raio + Math.random() * (W - 2 * 2 * raio);
    let yInit = 2 * raio + Math.random() * (H - 2 * 2 * raio);

    let velocidade = 10;

    b.push(new Ball(xInit, yInit, raio, direction, color, velocidade))
}

/*______________________________________________RENDER______________________________________________________________________*/

let rightKey = false, leftKey = false, mouseClicked = false;
let frameIndex = 0;
let shoot = 0
let bgY = Math.floor(Math.random() * 20) * 200 + 10;

let player1 = new Player(images["player"])
let gun1 = new Gun(images["gun"])

let ballon = new Ballon(images["balloons"])


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
        gun1.update(gun1.sx, gun1.sy - 15)
    } else {
        gun1.update(player1.sx, player1.sy)
        shoot = 0
    }
    mouseClicked = false

    player1.draw()
    player1.update(player1.swidth * 4 + 4, -2)

    ballon.draw()
    ballon.update(player1.sx, player1.sy)

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