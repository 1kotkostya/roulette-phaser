import Phaser from 'phaser';


let game;

const gameOptions = {
    slices: 37,
    prizes: ["0", "32", "15", "19", "4", "21", "2", "25", "17", "34", "6", "27", "13", "36", "11", "30", "8", "23", "10", "5", "24", "16", "33", "1", "20", "14", "31", "9", "22", "18", "29", "7", "28", "12", "35", "3", "26"],
    rotationTime: 3000
}

window.onload = function() {

    const gameConfig = {
        type: Phaser.AUTO,
        width: 450,
        height: 450,
        backgroundColor: 0x880022,
        scene: {
            preload: preload,
            create: create,
        }
    };

    game = new Phaser.Game(gameConfig);

    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

function preload(){

    this.load.image("wheel", "/static/assets/roulette.webp");
    this.load.image("pin", "/static/assets/pin.png");
}

function create(){
    this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");
    this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin").setInteractive();
    this.prizeText = this.add.text(game.config.width / 2, game.config.height - 20, "Spin the roulette", {
        font: "bold 32px Arial",
        align: "center",
        color: "white"
    });
    this.prizeText.setOrigin(0.5);
    this.canSpin = true;
    // i know it's not good, we would change image in real project))
    this.pin.setScale(1.7).setRotation(0.03);

    const spinWheel = () =>  {
        if(this.canSpin){
            this.prizeText.setText("");
            let rounds = Phaser.Math.Between(4,6);
            let degrees = Phaser.Math.Between(0, 360);
            let prize = gameOptions.slices - 1 - Math.floor(degrees / (360 / gameOptions.slices));
            this.canSpin = false;
            this.tweens.add({
                targets: [this.wheel],
                angle: 360 * rounds + degrees,
                duration: gameOptions.rotationTime,
                ease: "Cubic.easeOut",
                callbackScope: this,

                onComplete: (tween) => {
                    this.prizeText.setText(gameOptions.prizes[prize]);
                    this.canSpin = true;
                }
            });
        }
    }
    this.pin.on("pointerdown", spinWheel, this);
}

// pure javascript to scale the game
function resize() {
    const canvas = document.querySelector("canvas");
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
