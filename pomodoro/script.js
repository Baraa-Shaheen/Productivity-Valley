// variables

let workTitle = document.getElementById('work');
let breakTitle = document.getElementById('break');

////////////////////////////////////////////////////////////
// fetch from database //
let workTime = 0;
let breakTime = 0;

let seconds = "15";

/////////////////////////////////////////////////////////////

let stop = true;
let breakState = false;

let redColour = true; //initial colour state

// display
window.onload = () => {
    document.getElementById('minutes').innerHTML = workTime;
    document.getElementById('seconds').innerHTML = seconds;
    document.getElementById('start').style.display = "block";
    document.getElementById('pause').style.display = "none";
    document.getElementById('play-pause').style.display = "none";
}

// start timer
function start() {    
    let workMinutes = workTime;
    let breakMinutes = breakTime;

    stop = false;
    // change button
    document.getElementById('start').style.display = "none";
    document.getElementById('pause').style.display = "block";
    document.getElementById('play-pause').style.display = "block";

    // change the time
    if (seconds == "00"){
        seconds = 60;
        workMinutes = workTime - 1;
        breakMinutes = breakTime - 1;
    }

    breakCount = 0;

    // countdown
    let timerFunction = () => {
        //change the display
        document.getElementById('minutes').innerHTML = workMinutes;

        if (stop==false){
            // start
        seconds = seconds - 1;
        if (seconds < 10){
            document.getElementById('seconds').innerHTML = "0" + seconds;
        }
        else{
            document.getElementById('seconds').innerHTML = seconds;
        }

        if(seconds == 0) {
            workMinutes = workMinutes - 1;
            if(workMinutes == -1){
                if(breakCount % 2 == 0) {
                    // start break
                    workMinutes = breakMinutes;
                    colourSwitcher();
                    breakCount++

                }else {
                    // continue work
                    workMinutes = workTime;
                    colourSwitcher();
                    breakCount++
                }
            }
            seconds = 60;
        }
    }
    else{
        document.getElementById('minutes').innerHTML = workMinutes;
        document.getElementById('seconds').innerHTML = seconds;
        clearInterval(myInterval);
    }
        }

    // start countdown
    const myInterval = setInterval(timerFunction, 1000); // 1000 = 1s
}

function pause(){
    stop = true;
    // change button
    document.getElementById('start').style.display = "block";
    document.getElementById('pause').style.display = "none";
    document.getElementById('play-pause').style.display = "none";

    //take the remaining time
    workMinutes = document.getElementById('minutes').innerHTML;
    seconds = document.getElementById('seconds').innerHTML;
}

function rest(){}

function skip(){
    colourSwitcher();
    breakState = !breakState;
    if (breakState == true){
        rest();
    }
}

function colourSwitcher(){
    let circleColour = document.getElementById('circle');
    redColour = !redColour;
    if (redColour){
        circleColour.style.backgroundColor = "hsl(358, 78%, 69%)";
    }
    else{
        circleColour.style.backgroundColor = "hsl(72, 65%, 71%)";
    }
}