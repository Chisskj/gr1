const canvas = document.querySelector('canvas');
const c= canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.2

class Sprite {
    constructor({
      position,
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 }
    }) {
      this.position = position
      this.width = 50
      this.height = 150
      this.image = new Image()
      this.image.src = imageSrc
      this.scale = scale
      this.framesMax = framesMax
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 5
      this.offset = offset
    }
  
    draw() {
      c.drawImage(
        this.image,
        this.framesCurrent * (this.image.width+200 / this.framesMax),
        0,
        this.image.width+200 / this.framesMax,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width+200 / this.framesMax) * this.scale,
        this.image.height * this.scale
      )
      if(this.isAttacking == true)
      {
        console.log(this.isAttacking);
        c.fillStyle = 'green';
        c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
        )
      }
    }
  
    animateFrames() {
      this.framesElapsed++
  
      if (this.framesElapsed % this.framesHold === 0) {
        if (this.framesCurrent < this.framesMax - 1) {
          this.framesCurrent++
        } else {
          this.framesCurrent = 0
        }
      }
    }
  
    update() {
      this.draw()
      this.animateFrames()
    }
  }

  class Fighter extends Sprite {
    constructor({
      position,
      velocity,
      color = 'red',
      imageSrc,
      scale = 1,
      framesMax = 1,
      offset = { x: 0, y: 0 },
    attackBox = { offset: {x:175,y:0}, width: 100, height: 50 }
    }) {
      super({
        position,
        imageSrc,
        scale,
        framesMax,
        offset
      })
  
      this.velocity = velocity
      this.width = 50
      this.height = 150
      this.lastKey
      this.attackBox = {
        position: {
          x: this.position.x,
          y: this.position.y
        },
        offset: this.offset,
        width: attackBox.width,
        height: attackBox.height
      }
      this.color = color
      this.isAttacking
      this.health = 100
      this.framesCurrent = 0
      this.framesElapsed = 0
      this.framesHold = 5
      this.dead = false
  
    }
  
    update() {
      this.draw()
      if (!this.dead) this.animateFrames()
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x
      this.attackBox.position.y = this.position.y + this.attackBox.offset.y
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
        this.velocity.y = 0
        this.position.y = 330
      } else this.velocity.y += gravity
    }
  
    attack() {
      this.isAttacking = true
    }
  
  }
const background = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './image/background.png'
})
const player = new Fighter({
    position: {
      x: 40,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    },
    imageSrc: './image/luffy.png',
    framesMax: 1,
    scale: 0.075,
    offset: {
      x: 30,
      y: 0
    }
});
const enemy = new Fighter({
        position: {
          x: 800,
          y: 100
        },
        velocity: {
          x: 0,
          y: 0
        },
        color: 'blue',
        imageSrc: './image/yellow.png',
        framesMax: 1,
        scale: 0.25,
        offset: {
          x: -40,
          y: 0
        }
})

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    }
}
let lastkey;
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
  }
  
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Luffy Wins'
    } else if (player.health < enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Yellow Wins'
    }
  }
  let timer = 60
  let timerId
  function decreaseTimer() {
    if (timer > 0) {
      timerId = setTimeout(decreaseTimer, 1)
      timer--
      document.querySelector('#timer').innerHTML = timer
    }
  
    if (timer === 0) {
      determineWinner({ player, enemy, timerId })
    }
  }
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    player.update()
    enemy.update()
    //player movement
    player.velocity.x = 0
    if(keys.a.pressed && player.lastkey == 'a'){
        player.velocity.x = -5
    }
    else if(keys.d.pressed && player.lastkey == 'd'){
        player.velocity.x = 5
    }
    //enermy movement
    
   // console.log(keys.ArrowRight.pressed);
    enemy.velocity.x = 0
    if(keys.ArrowRight.pressed && enemy.lastkey == 'ArrowRight'){
        enemy.velocity.x = 5
    }
    else if(keys.ArrowLeft.pressed && enemy.lastkey == 'ArrowLeft'){
        enemy.velocity.x = -5
    }
    //detect for collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && 
        player.isAttacking
      ){
          player.isAttacking = false
          enemy.health-=10
          document.querySelector('#enemyHealth').style.width = enemy.health + '%'
          console.log("ngu")
      }
      if(
        rectangularCollision({
            rectangle1:enemy,
            rectangle2: player
        }) && 
        enemy.isAttacking
        
      ){
          enemy.isAttacking = false
          player.health -=10
          document.querySelector('#playerHealth').style.width = player.health + '%'
          console.log("kongu")
      }
      //end game base on health
      
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}
animate()

window.addEventListener('keydown', (event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastkey ='d'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w':
            player.velocity.y = -10
            break
        
        case ' ':
            player.attack()
            break
        
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
            
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -10
            break
        case '1':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case ' ':
            player.isAttacking = false;
            break
        }
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case '1':
            enemy.isAttacking = false;
            break
    }
    console.log(event.key);
})
