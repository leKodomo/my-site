class Controller{
        constructor(view, innerWidth, innerHeight, mouse, canvas){
            this.canvas = canvas
            this.view = view;
            this.mouse = mouse;
            this.innerWidth = innerWidth;
            this.innerHeight = innerHeight;

            this.isColorChange = false,
            this.transition = false,
            this.currentState = "particle",
            this.nextState = "rain",
            this.initialStateValue = 1,
            this.nextStateValue = 0

            this.backgroundL = {r: 0, g: 0, b: 0, a: 1}
            this.targetBackgroundL = {r: 0, g: 0, b: 0, a: 1}
            this.backgroundR = {r: 0, g: 0, b: 50, a: 1}
            this.targetBackgroundR = {r: 0, g: 0, b: 50, a: 1}

            this.allMyActors1 = [];
            this.allMyActors2 = [];
            this.allMyActors3 = [];
            this.allMyActors4 = [];
            this.maxRadius = 40;
            this.noOfActors = 800;
            this.actorSpeed = 2;
            this.cursorAreaOfEffect = 30
        }
    
        init(innerWidth, innerHeight){
            if (this.innerWidth * this.innerHeight < 270000){
                this.noOfActors = 400
            }
            this.allMyActors = [];
            for (var i = 0; i < this.noOfActors; i++){
                var radius = Math.random() * 3 + 1;
                var x = Math.random() * (innerWidth - radius * 2) + radius;
                var y = Math.random() * (innerHeight - radius * 2) + radius;
                var dx = (Math.random() - 0.5) * this.actorSpeed;
                var dy = (Math.random() - 0.5) * this.actorSpeed;
                var blues = [[0, 0, 25, 1], [0, 0, 50, 1], [0, 0, 75, 1], [0, 0, 100, 1], [0, 0, 150, 1]];
                var colorIndex = Math.floor(Math.random() * 4)
                var colorR = blues[colorIndex][0]
                var colorG = blues[colorIndex][1]
                var colorB = blues[colorIndex][2]
                var colorA = blues[colorIndex][3]
    
    
                this.allMyActors.push(new Actor(x, y, dx, dy, radius, this.maxRadius, colorR, colorG, colorB, colorA, colorIndex))
            }
        }

        changeActorAmount(){
            
        }
    
        updateBackgroundColor(r1, g1, b1, r2, g2, b2){
            console.log('update color ran in controller')
            this.backgroundL.r = r1
            this.backgroundL.g = g1
            this.backgroundL.b = b1
            this.backgroundR.r = r2
            this.backgroundR.g = g2
            this.backgroundR.b = b2
            console.log(this.backgroundL)
            console.log(this.backgroundR)
        }
    
        updateParticleColor(r1, g1, b1, r2, g2, b2, r3, g3, b3, r4, g4, b4){
            console.log('update particle ran in controller')
    
        }
    
    
        frameCounter(){
            let fc = performance.now()
            
        }
    
        animateLoop(time) {
            if(time == 100){
                this.initialState = 'blue'
                this.nextState = 'rain'
                this.transition = true;
            }
    
            if(time == 200){
                this.initialState = 'rain'
                this.nextState = 'echo'
                this.transition = true
            }
    
            if (time == 300){
                this.initialState = 'echo'
                this.nextState = 'blue'
                this.transition = true;
            }
    
            // check for transition
            if(this.transition){
                if(this.nextStateValue >= 1){
                    this.transition = false
                    this.initialState = this.nextState
                    this.initialStateValue = 1
                    this.nextStateValue = 0
                }else{
                    this.initialStateValue -= 0.01
                    this.nextStateValue += 0.01
                }
            }
    
            // blue rule
            if (this.initialState == "blue"){
                for (var i = 0; i < this.allMyActors.length; i++){
                    var actor = this.allMyActors[i]
                    actor.updateBlue(innerWidth, innerHeight, mouse, this.initialStateValue);
                    actor.updateInteractiveSwell(mouse)
                    if (actor.outlineA < 1){
                        actor.outlineA += 0.01
                    }
                }
            }
    
            if (this.nextState == 'blue' && this.transition == true){
                for (var i = 0; i < this.allMyActors.length; i++){
                    var actor = this.allMyActors[i]
                    actor.updateBlue(innerWidth, innerHeight, mouse, this.nextStateValue);
                    if (actor.colorA < 1){
                        actor.colorA += 0.01
                    }
                }
    
                if (this.backgroundR.b < 50){
                    this.backgroundR.b += 1
                    this.canvas.style.background = `linear-gradient(to left, rgba(0, 0, 
                    ${this.backgroundR.b}, 1), rgba(0, 1, 0, 1))`
                }
            }
    
    
            // rain
            if (this.initialState == 'rain'){
                for (var i = 0; i < this.allMyActors.length; i++){
                    this.allMyActors[i].updateRain(innerWidth, innerHeight, mouse, this.initialStateValue, this.cursorAreaOfEffect);
                    this.allMyActors[i].updateInteractiveSwell(this.mouse)
                }
            }
            if (this.nextState == 'rain' && this.transition == true){
                for (var i = 0; i < this.allMyActors.length; i++){
                    this.allMyActors[i].updateRain(innerWidth, innerHeight, mouse, this.nextStateValue, this.cursorAreaOfEffect);
                }
            }
    
    
            // .........................echo..........................................
            if (this.initialState == 'echo'){
                for (var i = 0; i < this.allMyActors.length; i++){
                    var actor = this.allMyActors[i]
                    actor.updateEcho(innerWidth, innerHeight, mouse, this.initialStateValue);
                    actor.updateInteractiveEchoSwell(mouse)
                }
            }
    
            if (this.nextState == 'echo' && this.transition == true){
                for (var i = 0; i < this.allMyActors.length; i++){
                    var actor =this.allMyActors[i]
                    actor.updateEcho(innerWidth, innerHeight, mouse, this.initialStateValue);
                    actor.updateInteractiveEchoSwell(mouse)
                    if (actor.colorA > 0){
                        actor.colorA -= 0.01
                    }
                }
                if (this.backgroundR.b > 0){
                        this.backgroundR.b -= 2
                        canvas.style.background = `linear-gradient(to left, rgba(0, 0, ${this.backgroundR.b}, 1), rgba(0, 1, 0, 1))`
                }
              
            }
    
            for (var i = 0; i < this.allMyActors.length; i++){
                view.draw(this.allMyActors[i]);
            }
        }
        backgroundToString(){
            return `linear-gradient(to left, rgba(${this.backgroundL.r}, ${this.backgroundL.g}, ${this.backgroundL.b}, ${this.backgroundL.a}), `+
            `(${this.backgroundR.r}, ${this.backgroundR.g}, ${this.backgroundR.b}, ${this.backgroundR.a})`
        }
    }


// class Controller{
//     constructor(view, innerWidth, innerHeight, mouse, canvas){
//         this.canvas = canvas
//         this.isColorChange = false,
//         this.transition = false,
//         this.initialState = "blue",
//         this.nextState = "rain",
//         // this.transitionRate = 0.01, // as a percentage
//         // this.colorChangeMilliseconds = 100,
//         this.initialStateValue = 1,
//         this.nextStateValue = 0
//         this.view = view;
//         this.innerWidth = innerWidth;
//         this.innerHeight = innerHeight;
//         this.mouse = mouse;
//         this.backgroundL = {r: 0, g: 0, b: 0, a: 1}
//         this.backgroundR = {r: 0, g: 0, b: 50, a: 1}
//         this.allMyActors = [];
//         this.maxRadius = 40;
//         this.noOfActors = 800;
//         this.actorSpeed = 2;
//         this.cursorAreaOfEffect = 30
//     }

//     init(innerWidth, innerHeight){
//         if (this.innerWidth * this.innerHeight < 270000){
//             this.noOfActors = 400
//         }
//         this.allMyActors = [];
//         for (var i = 0; i < this.noOfActors; i++){
//             var radius = Math.random() * 3 + 1;
//             var x = Math.random() * (innerWidth - radius * 2) + radius;
//             var y = Math.random() * (innerHeight - radius * 2) + radius;
//             var dx = (Math.random() - 0.5) * this.actorSpeed;
//             var dy = (Math.random() - 0.5) * this.actorSpeed;
//             var blues = [[0, 0, 25, 1], [0, 0, 50, 1], [0, 0, 75, 1], [0, 0, 100, 1], [0, 0, 150, 1]];
//             var colorIndex = Math.floor(Math.random() * 4)
//             var colorR = blues[colorIndex][0]
//             var colorG = blues[colorIndex][1]
//             var colorB = blues[colorIndex][2]
//             var colorA = blues[colorIndex][3]


//             this.allMyActors.push(new Actor(x, y, dx, dy, radius, this.maxRadius, colorR, colorG, colorB, colorA, colorIndex))
//         }
//     }

//     updateBackgroundColor(r1, g1, b1, r2, g2, b2){
//         console.log('update color ran in controller')
//         this.backgroundL.r = r1
//         this.backgroundL.g = g1
//         this.backgroundL.b = b1
//         this.backgroundR.r = r2
//         this.backgroundR.g = g2
//         this.backgroundR.b = b2
//         console.log(this.backgroundL)
//         console.log(this.backgroundR)
//     }

//     updateParticleColor(r1, g1, b1, r2, g2, b2, r3, g3, b3, r4, g4, b4){
//         console.log('update particle ran in controller')

//     }


//     frameCounter(){
//         let fc = performance.now()
        
//     }

//     animateLoop(time) {
//         if(time == 100){
//             this.initialState = 'blue'
//             this.nextState = 'rain'
//             this.transition = true;
//         }

//         if(time == 200){
//             this.initialState = 'rain'
//             this.nextState = 'echo'
//             this.transition = true
//         }

//         if (time == 300){
//             this.initialState = 'echo'
//             this.nextState = 'blue'
//             this.transition = true;
//         }

//         // check for transition
//         if(this.transition){
//             if(this.nextStateValue >= 1){
//                 this.transition = false
//                 this.initialState = this.nextState
//                 this.initialStateValue = 1
//                 this.nextStateValue = 0
//             }else{
//                 this.initialStateValue -= 0.01
//                 this.nextStateValue += 0.01
//             }
//         }

//         // blue rule
//         if (this.initialState == "blue"){
//             for (var i = 0; i < this.allMyActors.length; i++){
//                 var actor = this.allMyActors[i]
//                 actor.updateBlue(innerWidth, innerHeight, mouse, this.initialStateValue);
//                 actor.updateInteractiveSwell(mouse)
//                 if (actor.outlineA < 1){
//                     actor.outlineA += 0.01
//                 }
//             }
//         }

//         if (this.nextState == 'blue' && this.transition == true){
//             for (var i = 0; i < this.allMyActors.length; i++){
//                 var actor = this.allMyActors[i]
//                 actor.updateBlue(innerWidth, innerHeight, mouse, this.nextStateValue);
//                 if (actor.colorA < 1){
//                     actor.colorA += 0.01
//                 }
//             }

//             if (this.backgroundR.b < 50){
//                 this.backgroundR.b += 1
//                 this.canvas.style.background = `linear-gradient(to left, rgba(0, 0, 
//                 ${this.backgroundR.b}, 1), rgba(0, 1, 0, 1))`
//             }
//         }


//         // rain
//         if (this.initialState == 'rain'){
//             for (var i = 0; i < this.allMyActors.length; i++){
//                 this.allMyActors[i].updateRain(innerWidth, innerHeight, mouse, this.initialStateValue, this.cursorAreaOfEffect);
//                 this.allMyActors[i].updateInteractiveSwell(this.mouse)
//             }
//         }
//         if (this.nextState == 'rain' && this.transition == true){
//             for (var i = 0; i < this.allMyActors.length; i++){
//                 this.allMyActors[i].updateRain(innerWidth, innerHeight, mouse, this.nextStateValue, this.cursorAreaOfEffect);
//             }
//         }


//         // .........................echo..........................................
//         if (this.initialState == 'echo'){
//             for (var i = 0; i < this.allMyActors.length; i++){
//                 var actor = this.allMyActors[i]
//                 actor.updateEcho(innerWidth, innerHeight, mouse, this.initialStateValue);
//                 actor.updateInteractiveEchoSwell(mouse)
//             }
//         }

//         if (this.nextState == 'echo' && this.transition == true){
//             for (var i = 0; i < this.allMyActors.length; i++){
//                 var actor =this.allMyActors[i]
//                 actor.updateEcho(innerWidth, innerHeight, mouse, this.initialStateValue);
//                 actor.updateInteractiveEchoSwell(mouse)
//                 if (actor.colorA > 0){
//                     actor.colorA -= 0.01
//                 }
//             }
//             if (this.backgroundR.b > 0){
//                     this.backgroundR.b -= 2
//                     canvas.style.background = `linear-gradient(to left, rgba(0, 0, ${this.backgroundR.b}, 1), rgba(0, 1, 0, 1))`
//             }
          
//         }

//         for (var i = 0; i < this.allMyActors.length; i++){
//             view.draw(this.allMyActors[i]);
//         }
//     }
//     backgroundToString(){
//         return `linear-gradient(to left, rgba(${this.backgroundL.r}, ${this.backgroundL.g}, ${this.backgroundL.b}, ${this.backgroundL.a}), `+
//         `(${this.backgroundR.r}, ${this.backgroundR.g}, ${this.backgroundR.b}, ${this.backgroundR.a})`
//     }
// }
