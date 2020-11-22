const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext("2d");

const W = canvas.width, H = canvas.height;

let images = {};
let totalResources = 4;
let numResourcesLoaded = 0;
let fps = 15;

loadImage("player");
loadImage("player2");
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
        player1 = new Player(images["player"], 20)
        player2 = new Player(images["player2"], W-100)
        ballon1 = new Ballon(images["balloons"], 100, 100, 60, 80, 20, 100, 'right', 0)
        ballon2 = new Ballon(images["balloons"], 100, 100, 60, 80, W-100, 50, 'left', 0)
        bArray.push(ballon1)
        bArray.push(ballon2)
        setTimeout(start, 2000)
    }
}

function start(){
    setInterval(render, 1000 / fps)
}

/*______________________________________________CLASSES______________________________________________________________________*/

class Player {
    constructor(img, sx) {
        this.img = img
        this.swidth = img.width / 8
        this.sheight = img.height / 3
        this.cx = this.swidth * 4 + 4
        this.cy = -2
        this.sx = sx
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

let dKey = false, aKey = false , wKey = false, arrowRightKey = false, arrowLeftKey = false, arrowUpKey = false, mouseClicked = false;
let frameIndex = 0;
let shoot = 0, shoot2 = 0

let player1;
let player2;
let gun1 = new Gun(images["gun"], -1000, -1000)
let gun2 = new Gun(images["gun"], -1000, -1000)

let nCollisions = 0
let colidePlayer1 = false
let colidePlayer2 = false
let ballDistance = 40
let colideWall1 = 0, colideWall2 = 0

let colide = false
let ballon1;
let ballon2;
let ballon3
let ballon4
let bArray = new Array();

let som1 = 0, som2 = 0, som3 = 0

let lifes = 3
let win = false, nballs = 0


function render() {
    ctx.clearRect(0, 0, W, H);

    if (lifes > 0 && win == false) {

        audioBackGround.play()
        ctx.drawImage(images["bg"], 10, 12 * 200 + 10, 253, 188, 0, 0, W, H);
        if (dKey && player1.sx < W - 100) {
            player1.update(frameIndex * player1.swidth + 2, player1.sheight * 2)
            player1.sx += 22;
        }
        if (aKey && player1.sx > 20) {
            player1.update(frameIndex * player1.swidth + 2, - 2)
            player1.sx -= 22;
        }

        if (arrowRightKey && player2.sx < W - 100) {
            player2.update(frameIndex * player2.swidth + 2, player2.sheight * 2)
            player2.sx += 22;
        }
        if (arrowLeftKey && player2.sx > 20) {
            player2.update(frameIndex * player2.swidth + 2, - 2)
            player2.sx -= 22;
        }

        if (wKey == true && colidePlayer1 == false) {
            playSoundEffects('shoot1.wav')
            player1.update(player1.swidth * 5 + 4, 0)
            gun1.update(player1.sx + 13, player1.sy)
            shoot = 1
        }

        if (arrowUpKey == true && colidePlayer2 == false) {
            playSoundEffects('shoot1.wav')
            player2.update(player2.swidth * 5 + 4, 0)
            gun2.update(player2.sx + 13, player2.sy)
            shoot2 = 1
        }

        if (shoot == 1 && gun1.sy > 5) {
            gun1.draw()
            gun1.update(gun1.sx, gun1.sy - 18)
        } else {
            gun1.update(-1000, -1000)
            shoot = 0
        }

        if (shoot2 == 1 && gun2.sy > 5) {
            gun2.draw()
            gun2.update(gun2.sx, gun2.sy - 18)
        } else {
            gun2.update(-1000, -1000)
            shoot2 = 0
        }

        for (let i = 0; i < bArray.length; i++) {
            const ballon = bArray[i];
            if (ballon.sx + ballon.w - ballDistance< player1.sx
                //totally to the left: no collision
                || ballon.sx + ballDistance> player1.sx + player1.w
                //totally to the right: no collision
                || ballon.sy + ballon.h < player1.sy
                //totally above: no collision
                || ballon.sy > player1.sy + player1.h) {
                
            }else{
                colidePlayer1 = true
                som1++
                if(som1 == 1){
                    audioLostFife.play();
                    lifes--
                }
            }

            if (ballon.sx + ballon.w - ballDistance< player2.sx
                //totally to the left: no collision
                || ballon.sx + ballDistance> player2.sx + player2.w
                //totally to the right: no collision
                || ballon.sy + ballon.h < player2.sy
                //totally above: no collision
                || ballon.sy > player2.sy + player2.h) {
                
            }else{
                colidePlayer2 = true
                som2++
                if(som2 == 1){
                    audioLostFife.play();
                    lifes--
                }
            }

            if (ballon.sx + ballon.w - 20 < gun1.sx
                //totally to the left: no collision
                || ballon.sx - ballon.w + ballDistance > gun1.sx
                //totally to the right: no collision
                || ballon.sy + ballon.h - 30 < gun1.sy
                //totally above: no collision
                || ballon.sy > gun1.sy + gun1.h1) {
                //totally below: no collision
            } else {
                playSoundEffects('ballon2.wav')
                shoot = 0
                nCollisions++
                colide = true
                ballon.collisions++
            }

            if (ballon.sx + ballon.w - 20 < gun2.sx
                //totally to the left: no collision
                || ballon.sx - ballon.w + ballDistance > gun2.sx
                //totally to the right: no collision
                || ballon.sy + ballon.h - 30 < gun2.sy
                //totally above: no collision
                || ballon.sy > gun2.sy + gun2.h1) {
                //totally below: no collision
            } else {
                playSoundEffects('ballon2.wav')
                shoot2 = 0
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
        if (colidePlayer1 == true) {
            player1.update(player1.swidth * 5 + 6, player1.sheight * 2 + 1)
            if (player1.sx > W - player1.swidth-100){
                colideWall1 = 1
            }

            if (colideWall1 == 1) {
                player1.sx -= 20
                player1.sy += 30
            }
            
            if (colideWall1 == 0){
                player1.sx += 25
                player1.sy -= 15
            }

            if (player1.sy > 800) {
                player1.sx = 20
                player1.sy = H - 110
                colidePlayer1 = false
                colideWall1 = 0
                som1 = 0
            }
        }

        if (colidePlayer2 == true) {
            player2.update(player2.swidth * 5 + 6, player2.sheight * 2 + 1)
            if (player2.sx > W - player2.swidth-100){
                colideWall2 = 1
            }

            if (colideWall2 == 1) {
                player2.sx -= 20
                player2.sy += 30
            }
            
            if (colideWall2 == 0){
                player2.sx += 25
                player2.sy -= 15
            }

            if (player2.sy > 800) {
                player2.sx = W-100
                player2.sy = H - 110
                colidePlayer2 = false
                colideWall2 = 0
                som2 = 0
            }
        }

        wKey = false
        arrowUpKey = false

        player1.draw()
        player1.update(player1.swidth * 4 + 4, -2)
        player2.draw()
        player2.update(player2.swidth * 4 + 4, -2)

        //Vidas do jogador
        if (lifes == 3) {
            ctx.drawImage(images["heart"], 20, 20, 25, 25);
            ctx.drawImage(images["heart"], 47, 20, 25, 25);
            ctx.drawImage(images["heart"], 74, 20, 25, 25);
        }else if(lifes == 2){
            ctx.drawImage(images["heart"], 20, 20, 25, 25);
            ctx.drawImage(images["heart"], 47, 20, 25, 25);
        }else if(lifes == 1){
            ctx.drawImage(images["heart"], 20, 20, 25, 25);
        }
        
        frameIndex++;
        if (frameIndex == 4)
            frameIndex = 0;

    }else if(lifes < 1){

        ctx.drawImage(images["bg"], 10, 13 * 200 + 10, 253, 188, 0, 0, W, H);
        audioBackGround.pause();
        audioBackGround.currentTime = 0;
        som3++

        if (som3 == 1) {
            playSoundBackground('gameover.wav')
        }

        ctx.fillStyle = 'white'
        ctx.font = 'bold 50px Arial';
        let text = "GAME OVER";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText (text, canvas.width/2, canvas.height/2);

        setTimeout(function(){ window.location.href='../index.html'; }, 7000);
    }

    if (bArray.length == 4) {
        if (bArray.every(ball => ball.collisions == 3)) {
            win = true

            ctx.drawImage(images["bg"], 10, 12 * 200 + 10, 253, 188, 0, 0, W, H);
            audioBackGround.pause();
            audioBackGround.currentTime = 0;
            som3++
            if (som3 == 1) {
                playSoundBackground('wingame.wav')
            }

            ctx.fillStyle = 'white'
            ctx.font = 'bold 50px Arial';
            let text = "YOU WIN";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText (text, canvas.width/2, canvas.height/2);

            setTimeout(function(){ window.location.href='../index.html'; }, 4000);
        }
    }
    
}

/*______________________________________________EVENTOS RATO E TECLADO______________________________________________________________________*/

function ArrowPressed(e) {
    if (e.keyCode == 68) {
        dKey = true;
    }
    if (e.keyCode == 65) {
        aKey = true;
    }
    if (e.keyCode == 87) {
        wKey = true;
    }
    if (e.keyCode == 39) {
        arrowRightKey = true;
    }
    if (e.keyCode == 37) {
        arrowLeftKey = true;
    }
    if (e.keyCode == 38) {
        arrowUpKey = true;
    }
    e.preventDefault()
}

function ArrowReleased(e) {
    if (e.keyCode == 68) {
        dKey = false;
        player1.cy = -2
    } else if (e.keyCode == 65)
        aKey = false;
    player1.cx = player1.swidth * 4 + 4

    if (e.keyCode == 39) {
        arrowRightKey = false;
        player2.cy = -2
    } else if (e.keyCode == 37)
        arrowLeftKey = false;
    player2.cx = player2.swidth * 4 + 4
}

window.addEventListener('keydown', ArrowPressed);
window.addEventListener('keyup', ArrowReleased);

/*______________________________________________AUDIO______________________________________________________________________*/

const audioBackGround = new Audio('sounds/track1.mp3');
audioBackGround.volume = 0.1;

const audioLostFife = new Audio('sounds/lostlife.wav');
audioLostFife.volume = 0.1;

function playSoundEffects(sound) {
    const audio = new Audio('sounds/' + sound);
    audio.volume = 0.3;
    audio.play();
}

function playSoundBackground(sound) {
    const audio = new Audio('sounds/' + sound);
    audio.volume = 0.3;
    audio.play();
}

/*______________________________________________MOSTRAR NIVEL______________________________________________________________________*/

function showLevel(){
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'white'
    ctx.font = 'bold 50px Arial';
    let text = "LEVEL 2";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText (text, canvas.width/2, canvas.height/2);
}

showLevel()