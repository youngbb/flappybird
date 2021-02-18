//Tutorial Watch on YOUTUB channel -- CODE EXPLAINED -- "CREATE THE ORIGINAL FLAPPY BIRD GAME"

const cvs = document.getElementById("gameBoard");
const ctx = cvs.getContext("2d");

/* Game Vars & Consts*/
let frames = 0;


/* Get all Images and set to varables */

// function loadImage(imgName,src){
//     imgName = new Image();
//     imgName.src = src;
//     return imgName;
// }
// const bgImage = loadImage("bg","images/bg.png");
// const birdImage = loadImage("bg","images/bird.png");
// const fgImage = loadImage("bg","images/fg.png");
// const pipeNorthImage = loadImage("bg","images/pipeNorth.png");
// const pipeSouthImage = loadImage("bg","images/pipeSouth.png");
    sprite = new Image();
    sprite.src = 'images/sprite.png';
 

// Background object
const bg = {
    sx: 0,
    sy: 0,
    sWidth: 274,
    sHeight: 226,
    dx: 0,
    dy: 0,
    dWidth: 364,
    dHeight: 300,
    draw: function(){
        /*ctx DrawImage agrs 
        image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight*/
        
        ctx.drawImage(sprite,this.sx, this.sy, this.sWidth, this.sHeight, this.dx, cvs.clientHeight-this.dHeight, this.dWidth, this.dHeight);
        ctx.drawImage(sprite,this.sx, this.sy, this.sWidth, this.sHeight, this.dx+this.dWidth, cvs.clientHeight-this.dHeight, this.dWidth, this.dHeight);
       
    }
}
// Foreground Object
const fg = {
    sx: 276,
    sy: 0,
    sWidth: 224,
    sHeight: 112,
    dx: 0,
    dy: 0,
    dWidth: 240,
    dHeight: 112,
    draw: function(){
        /*ctx DrawImage agrs 
        image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight*/
        
        ctx.drawImage(sprite,this.sx, this.sy, this.sWidth, this.sHeight, this.dx, cvs.clientHeight-this.dHeight, this.dWidth, this.dHeight);
        ctx.drawImage(sprite,this.sx, this.sy, this.sWidth, this.sHeight, this.dx+ this.dWidth, cvs.clientHeight-this.dHeight, this.dWidth, this.dHeight);
        ctx.drawImage(sprite,this.sx, this.sy, this.sWidth, this.sHeight, this.dx+this.dWidth*2, cvs.clientHeight-this.dHeight, this.dWidth, this.dHeight);
    },
    update: function(){
        if(state.current == state.game){
            this.dx = (this.dx-2)%(this.dWidth/2);
        }
    }
}
// PIPENORTH Object
const bird = {
    DEGREE: Math.PI/180,
    speed: 0,
    gravity: 0.25,
    jump: 4.6,
    animation: [
        {sx: 277, sy: 113},
        {sx: 277, sy: 139},
        {sx: 277, sy: 165},
        {sx: 277, sy: 139}
    ],    
    sWidth: 34,
    sHeight: 26,
    dx: 50,
    dy: 150,
    dWidth: 65,
    dHeight: 50,
    frame: 0,   
    rotation: 0,
    radius: 12,
    speedReset: function(){
        
        this.speed = 0;
    },
    draw: function(){
        /*ctx DrawImage agrs 
        image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight*/
        let bird = this.animation[this.frame];
        ctx.save();
        ctx.translate(this.dx, this.dy);        
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite,bird.sx, bird.sy, this.sWidth, this.sHeight, -this.dWidth/2, -this.dHeight/2, this.dWidth, this.dHeight);
        
        ctx.restore();
    },
    flap: function(){
        this.speed = - this.jump;

    },
    update: function(){

        //Learn more about
        //animates bird wings
        if(state.current == state.getReady){
            
            
        }
            this.period = state.current == state.getReady ? 10 : 5;        
            this.frame += frames%this.period == 0 ? 1: 0;
            this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){
            this.dy = 150;
            //this.speed = 0;
            this.rotation = 0 * this.DEGREE;
            
        }else{
             this.speed += this.gravity;
             this.dy += this.speed;
            
            if(this.dy + this.dHeight/2 >= cvs.clientHeight-fg.dHeight){
                
                this.dy = cvs.clientHeight - fg.dHeight - this.dHeight/2;                
                if(state.current == state.game){
                    console.log(this.speed, this.gravity, this.jump, this.dy);                    
                    state.current = state.over;
                                        
                }
            }

            if(this.speed >= this.jump){
                this.rotation = 90 * this.DEGREE;
                this.frame = 1
            }else{
                this.rotation = -25 * this.DEGREE;
            }
        }

        
    }
    
}
// PIPEs Object
const pipes = {
    bottom: {
        sx: 502,
        sy: 0
    },
    top: {
        sx: 554,
        sy: 0
    },
    sWidth:54,
    sHeight:400,
    dx:0,
    dy:0,
    dWidth:90,
    dHeight:450,
    gap:145,
    ddx: 2,
    position: [],
    maxYPOS: -150,
    reset: function(){
        this.position = [];
    },
    update: function(){
        if(state.current !== state.game) return;

        //NOTES: 
        if(frames%100 == 0){
            this.position.push({
                x: cvs.clientWidth,
                y: this.maxYPOS * (Math.random() + 1)
            });
        }
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            let bottomPipeY = p.y + this.gap + this.dHeight;
            


            //Collisions
            if(bird.dx + bird.radius > p.x && bird.dx - bird.radius < p.x + this.dWidth && bird.dy + bird.radius > p.y && bird.dy - bird.radius < p.y + this.dHeight){
                state.current = state.over;
                console.log("top");
            }
            if(bird.dx + bird.radius > p.x && bird.dx - bird.radius < p.x + this.dWidth && bird.dy + bird.radius > bottomPipeY && bird.dy - bird.radius < bottomPipeY + this.dHeight){
                state.current = state.over;
                console.log("bottom");
            }


            p.x -=this.ddx;

            if(p.x + this.dWidth <= 0){
                this.position.shift();
                score.value +=1;
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }

    },
    draw: function(){
        /*ctx DrawImage agrs 
        image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight*/
        for(let i = 0; i < this.position.length; i++){

            let p = this.position[i];
            let topYPos = p.y;
            let bottomYPos = p.y + this.gap + this.dHeight;

            ctx.drawImage(sprite, this.top.sx,this.top.sy, this.sWidth, this.sHeight, p.x, topYPos, this.dWidth, this.dHeight);
            ctx.drawImage(sprite,this.bottom.sx,this.bottom.sy, this.sWidth, this.sHeight, p.x, bottomYPos, this.dWidth, this.dHeight);
    

        }
        
        
        
    }
}
// Get Ready Message
const getReady = {
    sx: 0,
    sy: 228,
    sWidth: 173,
    sHeight: 152,
    dx: cvs.clientWidth/2,
    dy: cvs.clientHeight/2,
    dWidth: 175,
    dHeight: 152,
    draw: function(){
        /*ctx DrawImage agrs 
        image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight*/
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sx, this.sy, this.sWidth, this.sHeight, this.dx-this.dWidth/2, this.dy-this.dHeight/2, this.dWidth, this.dHeight);
        }
    }
}
// Game over Message
const gameOver = {
    sx: 174,
    sy: 228,
    sWidth: 227,
    sHeight: 200,
    dx: cvs.clientWidth/2,
    dy: cvs.clientHeight/2,
    dWidth: 227,
    dHeight: 200,
    draw: function(){
        /*ctx DrawImage agrs 
        image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight*/
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sx, this.sy, this.sWidth, this.sHeight, this.dx-this.dWidth/2, this.dy-this.dHeight/2, this.dWidth, this.dHeight);
        }
    }
}

const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,
    draw: function(){
        ctx.fillStyle="#fff";
        ctx.strokeStyle = "#000";

        if(state.current == state.game){
            ctx.lineWidth = 1.5;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.clientWidth/2, 50);
            ctx.strokeText(this.value, cvs.clientWidth/2, 50);
        }else if(state.current == state.over){
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 365, 397);
            ctx.strokeText(this.value, 365, 397);

            ctx.fillText(this.best, 365, 437);
            ctx.strokeText(this.best, 365,437);
        }



    }
}



const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}


cvs.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            break;
        case state.game: 
            bird.flap();
            break;
        case state.over: 
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            console.log(rect,clickY, clickX);
            // Check if we are in the button area
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h ){
                bird.speedReset();
                pipes.reset();
                state.current = state.getReady;
               
            }
            
            break;
    }
});

const startBtn = {
    x:260,
    y:472,
    w:83,
    h:29
}




function draw(){
    ctx.fillStyle = "#5f9ea0";
    ctx.fillRect(0,0, cvs.clientWidth, cvs.clientWidth);

    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    


}
function update(){
    bird.update();
    fg.update();
    pipes.update();


}
function loop(){
    
    update();    
    draw();
    frames++;
    requestAnimationFrame(loop);
}
loop();


