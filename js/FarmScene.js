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
        this.load.image('shackFarmhouse', '../assets/house/shack-farmhouse.png');
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
        this.load.spritesheet("butterfly1AS", "../assets/animals/butterfly2-as.png", {frameWidth: 16, frameHeight:16 })
        this.load.spritesheet("butterfly2AS", "../assets/animals/butterfly2-as.png", {frameWidth: 16, frameHeight:16 })
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
            delay: 8000,
            callback: () => generateCloud(this),
            loop: true
        });
        
        this.add.image(320, 550, 'fence');
        

        this.butterflies = [];
        this.anims.create({
            key: "butterfly1Anim",
            frames: this.anims.generateFrameNumbers("butterfly1AS", {start: 0, end: 3}),
            frameRate: 20,
            yoyo: true
        })

        this.time.addEvent({
            delay: 5000,
            callback: () => generateButterfly(this),
            loop: true
        })

        //animation driver 20 fps
        this.skip = 0; // skip frames for 10fps or 5fps or 4fps or 8.333 fps
        this.time.addEvent({
            delay: 50,
            callback: () => this.updateAnimations(),
            loop: true
        })


        this.anims.create({
            key: 'farmhouseAnimation',
            frames: this.anims.generateFrameNumbers('farmhouseSpritesheet', { start: 0, end: 4 }),
            frameRate: 6,
            repeat: -1 // Repeat indefinitely
        });

        //Add farmhouse image and make it interactive
        this.farmhouse = this.add.sprite(64, 560, 'shackFarmhouse');
        //this.farmhouse.anims.play('farmhouseAnimation');
        this.farmhouse.setInteractive();
        Utility.addTintOnHover(this.farmhouse);

        //Add market sign image and make it interactive
        


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
        
        this.farm = new PlayerFarm();
        this.farm.createPlots(this);






        //When F key is pressed call toggleFullscreen function
        //Disabled for now as it doesn't quite work with the dialog element
        // this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F).on('down', Utility.toggleFullscreen);


        // the market sign has moved to this.farm.createPlots()

        // Switch to inside farmhouse scene when farmhouse is clicked (Keeps FarmScene running in background)
        this.farmhouse.on('pointerdown', () => {
            // Disable input for FarmScene
            if(!Utility.isEditMode()) {
                this.input.enabled = false;
                this.scene.launch('InsideFarmhouseScene');
            }
        });

        //set market sign to be one more than the crops.
        this.marketSign = this.add.image(600, 560, 'marketSign');
        this.marketSign.setInteractive();
        Utility.addTintOnHover(this.marketSign);
        this.marketSign.on('pointerdown', () => {
            // Disable input for FarmScene
            if(!Utility.isEditMode()) {
                this.input.enabled = false;
                this.scene.launch('MarketScene');
            }
        });




        // this.add.text(50, 450, 'Coins: ' + farm.coins , {fontSize: 20, fill: '#000000'});
        // this.coinsText = this.add.bitmapText(50, 480, 'pixelFont', 'Coins: ' + this.farm.coins, 32);
        // this.coinsText.setTint(0x000000);


        // const element = this.add.dom(320, 600).createFromCache('form');
        // element.addListener('click');

        // this.add.dom(320, 600, 'div', 'background-color: orange; width: 20vw; height: 20vw; font: 48px pixel-font', 'Phaser');


        // disable input when menu is shown
        // this.sys.game.input.enabled = false;



        let editButton = document.getElementById('edit-button');
        let tickButton = document.getElementById('tick-button');
        let plusButton = document.getElementById('plus-button');
        let trashButton = document.getElementById('trash-button');
        let crossButton = document.getElementById('cross-button');

        editButton.addEventListener('click', () => {


            Utility.toggleEditMode();
            editButton.style.display = 'none';
            tickButton.style.display = 'inline';
            plusButton.style.display = 'inline';
            trashButton.style.display = 'inline';
            crossButton.style.display = 'inline';

            // Save initial positions of objects so they can be reset if the user cancels the edit

            // If we are in InsideFarmhouseScene
            if(this.scene.isActive('InsideFarmhouseScene')) {
                console.log('Inside farmhouse scene is active');
                this.originalFurniture = this.farm.furniture.map(furniture => ({...furniture}));
            }
            // If we are in FarmScene
            else {
                this.originalPlots = this.farm.plots.map(plot => ({...plot}));
            }
        });

        crossButton.addEventListener('click', () => {
            if(Utility.isDeleteMode()){
                Utility.toggleDeleteMode();
            }
            Utility.toggleEditMode();
            tickButton.style.display = 'none';
            plusButton.style.display = 'none';
            trashButton.style.display = 'none';
            crossButton.style.display = 'none';
            editButton.style.display = 'inline';

            // Reset the positions of the objects
            if(this.scene.isActive('InsideFarmhouseScene')) {
                for (let i = 0; i < this.farm.furniture.length; i++) {
                    this.farm.furniture[i].x = this.originalFurniture[i].x;
                    this.farm.furniture[i].y = this.originalFurniture[i].y;
                }
            }
            // If we are in FarmScene
            else {
                for (let i = 0; i < this.farm.plots.length; i++) {
                    this.farm.plots[i].x = this.originalPlots[i].x;
                    this.farm.plots[i].y = this.originalPlots[i].y;
                }
            }
        });

        trashButton.addEventListener('click', () => {
            Utility.toggleDeleteMode();
        
        });

        tickButton.addEventListener('click', () => {
            if(Utility.isDeleteMode()){
                Utility.toggleDeleteMode();
            }
            Utility.toggleEditMode();
            tickButton.style.display = 'none';
            plusButton.style.display = 'none';
            trashButton.style.display = 'none';
            crossButton.style.display = 'none';
            editButton.style.display = 'inline';
            

            // Save the furniture state to the database
        });
    }

    updateAnimations() {
        for (let i = 0; i < this.butterflies.length; i++) {
            this.butterflies[i].updateY();
        }
        if (this.skip == 3) {
            this.skip = 0;
            for (let j = 0; j < this.clouds.length; j++) {
                this.clouds[j].moveX();
            }
        }
        this.skip++;
        
    }


}

function generateCloud(scene) {
    // Generate a random y position
    let y = Phaser.Math.Between(100, 460);

    // Select a random cloud image
    let randomIndex = Phaser.Math.Between(0, scene.cloudImages.length - 1);
    let randomImage = scene.cloudImages[randomIndex];

    // Create a new cloud at left edge of the screen and at the random y position, setDepth(-1) to make sure the clouds are behind the mountains
    let cloud = new Cloud({scene: scene, x: -50, y: y, texture: randomImage})
    // scene.physics.add.image(-50, y, randomImage).setDepth(-1);
    //cloud.setScale(Phaser.Math.Between(50, 75) / 100);

    // // Set the cloud's velocity to the right
    // cloud.setVelocityX(20);

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

function generateButterfly(scene) {
    let y = Math.floor(Math.random() * 200) + 450;
    let x = -20;
    let butterfly = new Butterfly ({
        animalName: "butterfly1",
        scene: scene,
        x: x,
        y: y,
        frameStartEnd: [0, 3],
        })
    butterfly.seed();
    scene.butterflies.push(butterfly);

    for(let i = 0; i < scene.butterflies.length; i++) {
        scene.butterflies[i].setDepth(10000);
    }
    

    for (let i = 0; i < scene.butterflies.length; i++) {
        if ((scene.butterflies[i].x < -20) || scene.butterflies[i].x > (screen.width + 40) ) {
            scene.butterflies[i].destroy();
            scene.butterflies.splice(i, 1);
        }
    }
}




// A PlayerFarm object will store the state of everything specific to a user on the website
class PlayerFarm {
    constructor(){
        // load playerstate from database
        this.coins = 0;
        this.plots = [];
        this.cropsOwned = [];
        this.furniture = [];
        this.decorations = [];
        this.animals = [];
    }

    createPlots(scene){
        let data = Utility.getUserData();
        
        let x, zoom;
        let y = 0;
        let along = false;
        // calculate camera offset and zoom based on plot number
        switch (data.plots.length) {
            case 2:
                x = -100;
                y = -40;
                zoom = 1.455;
                along = true;
                break;
            case 4:
                x = -100;
                zoom = 1.455;
                break;
            case 6:
                x = -50;
                zoom = 1.2;
                break;
            default:
                x = 0;
                zoom = 1;
        }
        // adjust camera
        // scene.cameras.main.setScroll(x, y)
        // scene.cameras.main.setZoom(zoom,zoom);
        let plotX,plotY;
        for(let i = 0; i < data.plots.length; i++){

            if (along) {
                plotX = 165 + (100 * (i));
                plotY = 610;
            } else {
                plotX = 165 + (100 * (i % (data.plots.length/2)));
                plotY = 610 + (100 * Math.floor(i / (data.plots.length/2)));
            }
            //adjustable plot numbers:

            
            let plot = new Plot({scene: scene, x: plotX, y: plotY, id: data.plots[i].id , crop: data.plots[i].crop, counter: data.plots[i].growthStage});
            this.plots.push(plot);
        }
        this.showCoins(scene, data.coins);
    }
    showCoins(scene, coins) {

    }

    createFurniture(scene){
        let data = Utility.getUserData();

        for(let i = 0; i < data.furniture.length; i++){
            let furniture = new Furniture({scene: scene, 
                                           x: data.furniture[i].x, 
                                           y: data.furniture[i].y, 
                                           type: data.furniture[i].type, 
                                           texture: data.furniture[i].type});
            this.furniture.push(furniture);
        }
    }
}

class Animal extends Phaser.GameObjects.Sprite{
    constructor (config) {
        super(config.scene, config.x, config.y, config.animalName+"AS")
        this.spritesheet = config.animalName + "AS";
        this.animal = config.animalName;
        this.scene = config.scene;
        this.animation = config.animalName + "Anim";
        this.scene.add.existing(this);
    }
}

class Cloud extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture);

        config.scene.add.existing(this);
    }
    moveX () {
        this.x ++;
    }
}

class Butterfly extends Animal {
    //this would work better with birds tbh.

    seed () {
        this.offset1 = (Math.random() * 2) | 0 + 2
        this.offset2 = (Math.random() * 3) | 0
        this.startingy = this.y;
    }
    graph (x) {
        let y = this.startingy + 20*(Math.sin(this.offset1*x ) + 4*Math.sin(1/5*x + this.offset2)) | 0;
        let deriv = 20*(Math.cos(this.offset1*x) + 4/5*Math.sin(1/5*x + this.offset2))
        let second_deriv =  20*( - 9*Math.sin(this.offset1*x ) - 4/25*Math.sin(1/5*x + this.offset2));
        if (second_deriv < 0 || deriv < -6) {
            if (!this.anims.isPlaying)
                this.anims.play(this.animation);
        }
        return y
    }
    updateY () {
        this.x += 2;
        this.y = this.graph(this.x/50);
    }
}



class Plot extends Phaser.GameObjects.Container{
    constructor(config) {
        //loads plot state 
        super(config.scene, config.x, config.y);
        this.scene = config.scene;
        this.id = config.id;
        this.crop = config.crop || "nothing";
        this.growthStage = config.counter || 0;
        this.growthStep = config.step || 0;
        this.cropSprites = [];
        this.placed = true;


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
            draggable: true
        });

        // Add a hover effect to the plot sprite of the container(for some reason Utility.addTintOnHover doesn't work here)
        this.on('pointerover', () => {
            if(Utility.isDeleteMode()) {
                this.plotSprite.setTint(0xff0000);
            }
            else {
                this.plotSprite.setTint(0xdddddd);
            }
        });

        this.on('pointerout', () => {
            this.plotSprite.clearTint();
        });

        
        // Dragging code (set draggable to true in setInteractive to enable dragging)
        this.scene.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            if(Utility.isEditMode()){
                gameObject.x = Math.round(dragX / 8) * 8;
                gameObject.y = Math.round(dragY / 8) * 8;

                // Keep the furniture within the bounds of the room

                if(gameObject.x + 42 + gameObject.width / 2 > 640) {
                    gameObject.x = 592;
                }
                
                if(gameObject.x - 42 - gameObject.width / 2 < 0) {
                    gameObject.x = 48;
                }
                if(gameObject.y + gameObject.height / 2 > 710) {
                    gameObject.y = Math.round(710 / 8) * 8 - gameObject.height / 2;
                }
                if(gameObject.y - gameObject.height / 2 < 605) {
                    gameObject.y = Math.round(605 / 8) * 8 + gameObject.height / 2;
                }
                gameObject.setDepth(gameObject.y);
            }
        });


        // this.scene.input.on('dragstart', function (pointer, gameObject) {
        //     if(Utility.isEditMode()){
        //         // Bring the gameObject to the top of the display list
        //         this.children.bringToTop(gameObject);
        //     }
        // }, this.scene);
        


        this.on('pointerdown', () => {
            if(!Utility.isEditMode()) {
                // if occupied, attempt harvest, if unoccupied, open start task menu.
                if (this.occupied) {
                    this.harvest();
                    this.occupied = false;
                }
                else {
                    //show menu
                    Utility.toggleMenu(this.scene, "taskMenu");
                    const self = this;
                    let form = document.getElementById("task-form");
                    let taskExitButton = document.getElementById('task-exit-button');
                    let subtasksCheck = document.getElementById("subtasks-query");
                const showHideSubtasks = function openHideSubtasks(event) {
                    let subtasksRows = document.getElementsByClassName("subtask-row");

                    for (let i = 0; i < subtasksRows.length; i++) {
                        if(subtasksCheck.checked) {subtasksRows[i].style.display = "block";} 
                        else {subtasksRows[i].style.display = "none";}
                    }
                }
                const addSubtask = function (event) {
                    let filled = true;
                    let subtasks = document.getElementsByClassName("subtask");
                    for (let i = 0; i < subtasks.length; i++) {
                        if (subtasks[i].value == "") {
                            filled = false;
                        }
                    }
                    if (filled && subtasks.length < 10) {
                        let table = document.getElementById("task-menu-table")
                        let newSubtask = document.createElement('input')
                        newSubtask.value = "";
                        let row = table.insertRow(table.rows.length - 2);
                        let cell = row.insertCell(0);
                        row.class = "subtask-row";
                        cell.innerHTML = '<label for="subtask"> - </label><input type ="text" class="subtask" name="subtask"></input>';
                    }
                }
                const close = function submitHandler(event) {
                        //starts crop growth, removes listeners, or just removes listeners
                        form.removeEventListener('submit', close);
                        taskExitButton.removeEventListener('click', close)
                    subtasksCheck.removeEventListener('click', showHideSubtasks);
                        Utility.toggleMenu(self.scene, "taskMenu");
                        if (event.type == "submit") {
                            event.preventDefault();
                            self.setupCrops();
                            Utility.sendCreatedTaskData();
                    }
                    }
                    //add subtask listener
                subtasksCheck.addEventListener('click', showHideSubtasks);
                //add subtaskfilled listener
                form.addEventListener('keydown', addSubtask);
                //add submit listener
                    form.addEventListener('submit', close);
                    //add exit listener
                    taskExitButton.addEventListener('click', close);

                    
                }
            }
            
        });
        this.scene.add.existing(this);
    }

    setupCrops() {
        if (this.occupied == true)
            this.resetPlot();
        
        this.crop = document.getElementById('crop').value;
        this.plantCrops();
        this.playGrowth();
    }

    resetPlot() {
        this.growthStage = 0;
        this.occupied = false;
        for(let cropSprite of this.cropSprites){
            cropSprite.destroy();
        }
        this.crop = "nothing";
        this.cropSprites = [];
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
        let self = this;

        //repeating function to grow crops individually
        this.tick = setInterval(function () {self.findCrop();}, 100);
    }

    findCrop() {
        //progress tracking
        if (this.growthStep === this.cropSprites.length) {
            this.growthStep = 0;
            this.growthStage++;

            //send current state and time to database to save growthStage
        }
        if (this.growthStage >= this.maxFrame - 1) {
            //crops finished

            //todo: prompt to harvest
            clearInterval(this.tick);
            console.log("crops finished!");
            alert(`Crops finished growing in: ${this.id}`);
            return;
        }

        //check if any crops are left too far behind by the growthStage
        for (let j = 1; j <= this.cropsLeft.length; j++) {
            if (this.cropSprites[this.cropsLeft[j - 1]].anims.getFrameName() <= this.growthStage - 2) {
                this.growSelectedCrop(this.cropsLeft[j - 1],j-1);
                return;
            }
        }

        //random number
        let rand = (Math.random() * this.cropsLeft.length) | 0;

        let upordown = (Math.random() * 2) | 0; // makes it seem more random when cycling through.

        //crop selection logic
        for (let i = 0; i < this.cropsLeft.length; i++) {
            if (this.cropSprites[this.cropsLeft[rand]].anims.getFrameName() > this.growthStage + 1) {
                if (upordown) {
                    rand ++;
                } else {
                    rand --;
                } //cycle through crops to find one to actually increment

                //reset random if out of range of list
                if (rand == this.cropsLeft.length) {
                    rand = 0;
                }
                else if (rand == 0) {
                    rand = this.cropsLeft.length - 1;
                }
                
                
            } 
            else {this.growSelectedCrop(this.cropsLeft[rand],rand); break;} //viable crop found
        }
    }
    growSelectedCrop(num,rand) { 
        //actually increment the frame of the crop
        if (this.cropsLeft.length != 0) { //here for safety's sake
            this.cropSprites[num].anims.nextFrame(1);
            if (this.cropSprites[num].anims.getFrameName() == this.maxFrame -1) {
                this.cropsLeft.splice(rand, 1); // remove from list of crops to grow
                console.log("finished growing crop");
            }
            this.growthStep++;
        }
        else {
            //in the event of the crops somehow finishing early, it will still finish the counter
            this.growthStep ++;
        }
    }

    pauseGrowth() {
        if (this.tick) {
            clearInterval(this.tick);
            console.log("Paused growing");
        }
    }

    harvest() {
        //todo: remove this once we 'lock' the plots when in pomodoro mode.
        if (this.tick) {
            clearInterval(this.tick);
        }
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
        //remove crops
        for(let cropSprite of this.cropSprites){
            cropSprite.destroy();
        }
        this.crop = "nothing";
        this.growthStage = 0;
        this.cropSprites = [];
    
    }
    
}



class Furniture extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.texture);

        // Set the type of this furniture
        this.type = config.type;

        // Store a reference to the scene
        this.scene = config.scene;

        // Whether or not the furniture is currently placed on the scene
        this.placed = true;

        // Enable input for this object
        this.setInteractive({ draggable: true });

        // Add a hover effect to the furniture
        Utility.addTintOnHover(this);

        // Add this object to the scene
        this.scene.add.existing(this);

        // Add a pointerdown event listener
        this.on('pointerdown', this.handleClick, this);

        this.scene.input.on('drag', function(pointer, gameObject, dragX, dragY) {
            if(Utility.isEditMode()) {
                // Snap the furniture to a grid
                gameObject.x = Math.round(dragX / 4) * 4;
                gameObject.y = Math.round(dragY / 4) * 4;

                // Keep the furniture within the bounds of the room
                if(gameObject.x + gameObject.width / 2 > 464) {
                    gameObject.x = 464 - gameObject.width / 2;
                }
                if(gameObject.x - gameObject.width / 2 < 176) {
                    gameObject.x = 176 + gameObject.width / 2;
                }
                if(gameObject.y + gameObject.height / 2 > 674) {
                    gameObject.y = 674 - gameObject.height / 2;
                }
                if(gameObject.y - gameObject.height / 2 < 526) {
                    gameObject.y = 526 + gameObject.height / 2;
                }
            }


        });

        this.scene.input.on('dragstart', function (pointer, gameObject) {
            // Bring the gameObject to the top of the display list
            if(Utility.isEditMode()){
                this.children.bringToTop(gameObject);
            }
        }, this.scene);

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
