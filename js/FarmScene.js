import Utility from "./Utility.js";


export default class FarmScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FarmScene' });
    }


    preload () {
        this.load.bitmapFont('pixelFont', '../fonts/pixeloperatorbitmap.png', '../fonts/pixeloperatorbitmap.xml');

        this.load.image('farmBackground', '../assets/farm-background.png');
        this.load.image('mountains', '../assets/mountains.png');
        this.load.image('fence', '../assets/fence.png');
        this.load.spritesheet('farmhouseSpritesheet', '../assets/farmhouse-animation.png', { frameWidth: 80, frameHeight: 128 });
        this.load.image('marketSign', '../assets/market-sign.png');
        this.load.image('sun', '../assets/sun.png');
        this.load.image('plot', '../assets/larger_plot.png');

        this.load.image('cloud1', '../assets/clouds/cloud1.png');
        this.load.image('cloud2', '../assets/clouds/cloud2.png');
        this.load.image('cloud3', '../assets/clouds/cloud3.png');
        this.load.image('cloud4', '../assets/clouds/cloud4.png');
        this.load.image('cloud5', '../assets/clouds/cloud5.png');
        this.load.image('cloud6', '../assets/clouds/cloud6.png');

        this.load.spritesheet("carrotGrowth", "../assets/crops/carrot-growth-AS.png", {frameWidth: 20, frameHeight: 30});
        this.load.spritesheet("sunflowerGrowth", "../assets/crops/sunflower-growth-AS.png", {frameWidth: 19, frameHeight: 41});
        
    }

    create () {
        this.add.image(320, 550, 'farmBackground').setDepth(-1);

        this.add.image(320, 520, 'mountains');

        this.sun = this.add.sprite(320, 455, 'sun').setDepth(-1);
        this.sun.setInteractive();
        Utility.addTintOnHover(this.sun);

        this.clouds = [];
        this.cloudImages = ['cloud1', 'cloud2', 'cloud3', 'cloud4', 'cloud5', 'cloud6'];
        
        //Generate initial cloud
        generateCloud(this);

        //Generate a new cloud every 5 seconds
        this.time.addEvent({
            delay: 2500,
            callback: () => generateCloud(this),
            loop: true
        });

        this.add.image(320, 550, 'fence');



        this.anims.create({
            key: 'farmhouseAnimation',
            frames: this.anims.generateFrameNumbers('farmhouseSpritesheet', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1 // Repeat indefinitely
        });

        //Add farmhouse image and make it interactive
        this.farmhouse = this.add.sprite(64, 560, 'farmhouseSpritesheet');
        this.farmhouse.anims.play('farmhouseAnimation');
        this.farmhouse.setInteractive();
        Utility.addTintOnHover(this.farmhouse);

        //Add market sign image and make it interactive
        this.marketSign = this.add.image(600, 560, 'marketSign');
        this.marketSign.setInteractive();
        Utility.addTintOnHover(this.marketSign);


        //Create crop animations.
        this.anims.create({
            key: 'carrotAnim',
            frames: this.anims.generateFrameNumbers("carrotGrowth", {start: 0, end: 10,}),
            frameRate: 1,
            repeat: 0
        })
        this.anims.create({
            key: 'sunflowerAnim',
            frames: this.anims.generateFrameNumbers("sunflowerGrowth", {start: 0, end: 10,}),
            frameRate: 1,
            repeat: 0
        })

        this.farm = new PlayerFarm(0,0,0,0,0);
        this.farm.createPlots(this);







        //When F key is pressed call toggleFullscreen function
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F).on('down', Utility.toggleFullscreen);


        // Switch to inside farmhouse scene when farmhouse is clicked (Keeps FarmScene running in background)
        this.marketSign.on('pointerdown', () => {
            // Disable input for FarmScene
            this.input.enabled = false;
            this.scene.launch('MarketScene');
        });

        // Switch to inside farmhouse scene when farmhouse is clicked (Keeps FarmScene running in background)
        this.farmhouse.on('pointerdown', () => {
            // Disable input for FarmScene
            this.input.enabled = false;
            this.scene.launch('InsideFarmhouseScene');
        });




        // this.add.text(50, 450, 'Coins: ' + farm.coins , {fontSize: 20, fill: '#000000'});
        // this.coinsText = this.add.bitmapText(50, 480, 'pixelFont', 'Coins: ' + this.farm.coins, 32);
        // this.coinsText.setTint(0x000000);
        

    }



}

function generateCloud(scene) {
    // Generate a random y position
    let y = Phaser.Math.Between(100, 460);

    // Select a random cloud image
    let randomIndex = Phaser.Math.Between(0, scene.cloudImages.length - 1);
    let randomImage = scene.cloudImages[randomIndex];

    // Create a new cloud at left edge of the screen and at the random y position, setDepth(-1) to make sure the clouds are behind the mountains
    let cloud = scene.physics.add.image(-50, y, randomImage).setDepth(-1);
    cloud.setScale(Phaser.Math.Between(50, 75) / 100);

    // Set the cloud's velocity to the right
    cloud.setVelocityX(20);

    // Add the cloud to the clouds array
    scene.clouds.push(cloud);

    // Loop through every cloud. If a cloud's x coordinate is greater than the canvas width, destroy it and remove it from the array
    for (let i = scene.clouds.length - 1; i >= 0; i--) {
        if (scene.clouds[i].x > scene.game.config.width) {
            scene.clouds[i].destroy();
            scene.clouds.splice(i, 1);
        }
    }
}



function getUserData() {
    // Called in create method of FarmScene
    // Fetches user data from the backend
    // Then formats data in appropriate way
    // This data is used to create a PlayerFarm object, which is then displayed


    // Using mock data for now until backend is implemented
    let data = {
        "coins": 300,
        "cropsOwned": ["tomato", "sunflower", "carrot", "potato"],
        "plots": [
          {"id": 1, "crop": "sunflower", "growthStage": 3}, 
          {"id": 2, "crop": "sunflower", "growthStage": 9}, 
          {"id": 3, "crop": "carrot", "growthStage": 2}, 
          {"id": 4, "crop": "carrot", "growthStage": 6},
          {"id": 5, "crop": "nothing", "growthStage": 0}, 
          {"id": 6, "crop": "sunflower", "growthStage": 6}, 
          {"id": 7, "crop": "nothing", "growthStage": 0},
          {"id": 100, "crop": "sunflower", "growthStage": 10} 
        ],
        "furniture": [
          {"type": "carpet1", "x": 320, "y": 612},
          {"type": "bookshelf", "x": 281, "y": 580},
          {"type": "fridge", "x": 193, "y": 580},
          {"type": "grandfatherClock", "x": 246, "y": 580},
          {"type": "kitchenSink", "x": 408, "y": 600},
          {"type": "chair", "x": 210, "y": 650},
          {"type": "table", "x": 192, "y": 650},
          {"type": "lamp", "x": 345, "y": 580},
          {"type": "toilet", "x": 452, "y": 658},
          {"type": "bathtub", "x": 370, "y": 660},
          {"type": "fireplace", "x": 221, "y": 565}
        ]
      }

      return data;
}

// A PlayerFarm object will store the state of everything specific to a user on the website
class PlayerFarm {
    constructor(coins, cropsOwned, decorationsOwned, decorationsPlaced, furnitureOwned, animals){
        this.coins = coins;
        this.plots = [];
        this.furniturePlaced = [];
        this.cropsOwned = cropsOwned;
        this.decorationsOwned = decorationsOwned;
        this.decorationsPlaced = decorationsPlaced;
        this.furnitureOwned = furnitureOwned;
        this.animals = animals;
    }

    createPlots(scene){
        let data = getUserData();

        for(let i = 0; i < data.plots.length; i++){
            let plotX = 165 + (100 * (i % 4));
            let plotY = 610 + (100 * Math.floor(i / 4));
            let plot = new Plot({scene: scene, x: plotX, y: plotY, id: data.plots[i].id , crop: data.plots[i].crop, gs: data.plots[i].growthStage});
            this.plots.push(plot);
        }

    }

    createFurniture(scene){
        let data = getUserData();

        for(let i = 0; i < data.furniture.length; i++){
            let furniture = new Furniture(scene, data.furniture[i].x, data.furniture[i].y, data.furniture[i].type, data.furniture[i].type);
            this.furniturePlaced.push(furniture);
        }
    }

}

class Plot extends Phaser.GameObjects.Container{
    constructor(config) {
        super(config.scene, config.x, config.y);

        this.scene = config.scene;
        this.id = config.id;
        this.crop = config.crop || "nothing";
        this.growthStage = config.gs || 0;
        this.growthStep = 0
        
        this.cropSprites = [];


        if (this.crop === "nothing") {
            this.occupied = false;
        } else {
            this.occupied = true;
        }

        // Create the plot sprite and add it to the container
        this.plotSprite = this.scene.add.sprite(0, 0, 'plot');
        Utility.addTintOnHover(this.plotSprite);
        this.add(this.plotSprite);

        // if there's crops saved, load those crops
        if(this.crop !== "nothing"){
            this.plantCrops();
        }

        // Make the container interactive
        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(-this.plotSprite.width/2, -this.plotSprite.height/2, this.plotSprite.width, this.plotSprite.height),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            draggable: false
        });

        // Add a hover effect to the plot sprite of the container(for some reason Utility.addTintOnHover doesn't work here)
        this.on('pointerover', () => {
            this.plotSprite.setTint(0xdddddd); // Change the color to your liking
        });

        this.on('pointerout', () => {
            this.plotSprite.clearTint();
        });

        // Add a click event listener
        this.on('pointerdown', () => {
            //alert(`Plot id: ${this.id}`);
            if (this.occupied) {
                this.harvest();
                this.occupied = false;
            }
            else {

                // ask for crop type etc.
                this.crop = "carrot"; //testing purposes

                this.plantCrops();
                
                this.playGrowth();
            }
            
        });

        

        // Dragging code (set draggable to true in setInteractive to enable dragging)

        // scene.input.on('drag', function(pointer, gameObject, dragX, dragY) {
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        // });

        // scene.input.on('dragstart', function (pointer, gameObject) {
        //     // Bring the gameObject to the top of the display list
        //     this.children.bringToTop(gameObject);
        // }, this.scene);
        
        // Add the container to the scene
        this.scene.add.existing(this);
    }

    plantCrops() {
        this.gridSize = 5;
        this.occupied = true;

        let cellWidth = this.plotSprite.width / this.gridSize;
        let cellHeight = this.plotSprite.height / this.gridSize;

        //Place crops
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                let x = col * cellWidth + cellWidth / 2;
                let y = row * cellHeight + cellHeight / 2;
                //If setOrigin is not 0,0 or 1,1 then when the plot container is moved the crop sprites will look wrong
                let crop = this.scene.add.sprite(x - 35, y - 40, this.crop + "Growth").setOrigin(1, 1).play(this.crop + "Anim");

                // immediately stops animation so that it can be controlled.
                crop.stop();
                //Set the frame of the crop sprite to the the current growth stage of the plot
                crop.setFrame(this.growthStage);
                
                
                //Push the crop sprite to the cropSprites array of the plot
                this.cropSprites.push(crop);
                //Add the crop sprite to the plot container
                this.add(crop);
            }
        }
        //Used for growth
        this.maxFrame = this.cropSprites[0].anims.getTotalFrames();
    }

    playGrowth() {

        console.log("started growing");
        
        //List of numbered references to possible cropSprites.
        this.cropsLeft = [];
        for (let i = 0; i < this.cropSprites.length; i++) {
            this.cropsLeft.push(i);
        }
        const self = this;

        //repeating function to grow crops individually
        this.tick = setInterval(function () {self.growSingle();}, 100);
    }
    
    growSingle() {
        //progress tracking
        if (this.growthStep === this.cropSprites.length) {
            this.growthStep = 0;
            this.growthStage++;
            //console.log("Max " + this.cropsLeft.length);
        }
        if (this.growthStage >= this.maxFrame - 1) {
            //crops finished
            
            //todo: prompt to harvest
            clearInterval(this.tick);
            console.log("crops finished!");
            alert(`Crops finished growing in: ${this.id}`);
            return;
        }
        
        //random number
        let rand = (Math.random() * this.cropsLeft.length) | 0;
        let num = this.cropsLeft[rand];

        //console.log(num);
        //crop selection logic
        for (let i = 0; i <= this.cropsLeft.length; i++) {
            if (this.cropSprites[num].anims.getFrameName() > this.growthStage + 1) {
                rand ++; //cycle through crops to find one to actually increment
                if (rand == this.cropsLeft.length) {
                    rand = 0;
                }
                //set the number
                num = this.cropsLeft[rand];
            } 
            else {break} //viable crop found
        }

        //actually increment the frame of the crop
        if (this.cropsLeft.length != 0) { //here for safety's sake
            this.cropSprites[num].anims.nextFrame(1);
            if (this.cropSprites[num].anims.getFrameName() == this.maxFrame -1) {
                this.cropsLeft.splice(rand, 1); // remove from list of crops to grow
            }
            this.growthStep++;
        }
        else {
            //in the event of the crops somehow finishing early, it will still finish the counter
            this.growthStep ++;
        }
    }


    harvest() {
        //todo: remove this once we 'lock' the plots when in pomodoro mode.
        if (this.tick) {
            clearInterval(this.tick);
        }
        //remove crops
        //calculate coins
        switch(this.crop){
            case "sunflower":
                this.scene.farm.coins += 100 * 1.2 * this.size * this.size; // i don' think we need to multiply by number of crops but anyway, this is better than a loop calculating
                // scene.coinsText.setText('Coins: ' + scene.farm.coins);
                break;
            case "carrot":
                this.scene.farm.coins += 100 * 1.5 * this.size * this.size;
                // scene.coinsText.setText('Coins: ' + scene.farm.coins);
                break;
        }
        for(let cropSprite of this.cropSprites){
            cropSprite.destroy();
        }
        this.crop = "nothing";
        this.growthStage = 0;
        this.cropSprites = [];
    
    }
    
}



class Furniture extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, type) {
        super(scene, x, y, texture);

        // Set the type of this furniture
        this.type = type;

        // Store a reference to the scene
        this.scene = scene;

        // Enable input for this object
        this.setInteractive({ draggable: true });

        // Add a hover effect to the furniture
        Utility.addTintOnHover(this);

        // Add this object to the scene
        scene.add.existing(this);

        // Add a pointerdown event listener
        this.on('pointerdown', this.handleClick, this);

        this.scene.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        scene.input.on('dragstart', function (pointer, gameObject) {
            // Bring the gameObject to the top of the display list
            this.children.bringToTop(gameObject);
        }, scene);

        if(this.type === "fireplace") {
            this.anims.play('fireplaceAnimation');
        }

    }

    handleClick() {
        if(this.type === "fireplace"){
            if(!this.scene.fireplaceTurnedOn) {
                this.anims.resume();
                this.scene.fireplaceTurnedOn = true
            }
            else {
                this.anims.pause();
                this.setTexture('fireplace');
                this.scene.fireplaceTurnedOn = false;
            }
        }

        else if(this.type === "lamp") {
            if(!this.scene.lampTurnedOn) {
                this.setTexture('lampOn');
                this.scene.lampTurnedOn = true;
            }
            else {
                this.setTexture('lamp');
                this.scene.lampTurnedOn = false;
            }
        }
    }



}