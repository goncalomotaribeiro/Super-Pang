const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

let images = {};
let totalResources = 3;
let numResourcesLoaded = 0;
let fps = 15;

loadImage("player");
loadImage("bg");
loadImage("gun");

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

class Player{
    constructor(img){
        this.img = img
        this.swidth = img.width / 8
        this.sheight = img.height / 3
        this.cx = this.swidth * 4 + 4
        this.cy = -2
        this.sx = W / 2
        this.sy = H - img.height -10;
        this.w = 95
        this.h = 95
    }

    draw(){
        ctx.drawImage(this.img, this.cx, this.cy, this.swidth, this.sheight, this.sx, this.sy, this.w, this.h);
    }

    update(cX, cY){
        this.cx = cX
        this.cy = cY
    }
}

class Gun{
    constructor(img, sx, sy){
        this.img = img
        this.sx = sx
        this.sy = sy
        this.w1 = 40
        this.h1 = 490
    }

    draw(){
        ctx.drawImage(this.img, this.sx, this.sy, this.w1, this.h1);
    }

    update(sX, sY){
        this.sx = sX
        this.sy = sY
    }
}

/*______________________________________________RENDER______________________________________________________________________*/

let rightKey = false, leftKey = false, mouseClicked = false;
let frameIndex = 0;
let shoot = 0
let bgY = Math.floor(Math.random() * 20) * 200 + 10;

let player1 = new Player(images["player"])
let gun1 = new Gun(images["gun"])

function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(images["bg"],10 , bgY, 253, 188, 0, 0, W, H);

    if (rightKey && player1.sx < W - 100)
    {
        player1.update(frameIndex * player1.swidth + 2, player1.sheight * 2)
        player1.sx += 22;
    }
    if (leftKey && player1.sx > 20){
        player1.update(frameIndex * player1.swidth + 2, - 2)
        player1.sx -= 22;
    }

    if (mouseClicked == true) {
        player1.update(player1.swidth * 5 + 4, 0)
        gun1.update(player1.sx + 15, player1.sy)
        shoot = 1
    }
    
    if(shoot == 1 && gun1.sy > 10){
        gun1.draw()
        gun1.update(gun1.sx, gun1.sy - 15)
    }else{
        gun1.update(player1.sx, player1.sy)
        shoot = 0
    }
    mouseClicked = false

    player1.draw()
    player1.update(player1.swidth * 4 + 4, -2)
    
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
    if (e.keyCode == 68){
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