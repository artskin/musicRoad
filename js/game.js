//import * as THREE from './libs/three.module.js';


var Game = function(){
    this.conf = {
        bgColor:0xdddddd,
        roadColor:0xffffff,
        playerColor:0x33ccff,
        cubeWidth:8,
        cubeHeight:3,
        cubeDeep:6,
        cubeSize:8,
        jumperColor: 0x33ccff,
        jumperWidth: 2, // jumper宽度
        jumperHeight: 2, // jumper高度
        jumperDeep: 2 // jumper深度
    }
    this.score = 0;
    this.screen = {
        width:414,
        height:736
    }
    this.scene = new THREE.Scene()
    this.cameraPos = {
        current: new THREE.Vector3(0, 0, 0), // 摄像机当前的坐标
        next: new THREE.Vector3() // 摄像机即将要移到的位置
    }
    // this.camera = new THREE.OrthographicCamera(
    //     this.screen.width/-10,
    //     this.screen.width/10,
    //     this.screen.height/10,
    //     this.screen.height/-10,
    //     1,
    //     5000
    // )
    this.camera = new THREE.PerspectiveCamera(
        45,
        this.screen.width/this.screen.height,
        1,
        3000
    )
    
    // this.camera.setViewOffset( 
    //     this.screen.width, 
    //     this.screen.height, 
    //     0, 
    //     0, 
    //     this.screen.width, 
    //     this.screen.height
    // );
    
    //this.songArr = [6,9,10,9,9,9,9,9,10,5,9,5,5,5,9,9,4,5,5,5/*20*/,4,4,2,2,2,2,5,1,1,1/*30*/,3,5,5,5,5,5,5,5,5,5/*40*/,5,2,2,2,2,2,2,2,2,2/*50*/,4,4,2,2,2,2,5,2,3,3/*60*/,2,2,2,2,2,4,4,4,4,4/*70*/,4,4,4,4,5,5,5,5,5,5,10,10];
    this.songArr = [4,3,5,6,3,3,1];
    //console.log(this.songArr)
    this.jumpers = [];
    this.cubeStat = {
        nextDir:1
    }
    this.roadsGroup = new THREE.Group()
};
var nextDir = 1;
function Brick(i,num,color,size){
    this.i = i;
    this.num= num;
    this.where = 1;
    this.color = color
    this.size = size
    this.material = new THREE.MeshLambertMaterial({ color: this.color })
    this.geometry = new THREE.BoxGeometry(this.size, 3, this.size,1,1,1);
    this.mesh     = new THREE.Mesh(this.geometry,this.material);
    this.mesh.scale.set( 0.01, 0.01, 0.01 );
    new TWEEN.Tween( this.mesh.scale ).to( {x:1,y:1,z:1}, 800 )
    .easing( TWEEN.Easing.Bounce.Out).start();
    return this.mesh;
}

Game.prototype={
    boot:function(){

    },
    over:function(){
        var _self = this;
        var btnRestart = document.getElementById("btn_restart");
        btnRestart.parentElement.setAttribute('style','display:block');
        btnRestart.addEventListener("click",function(){
            this.parentElement.remove();
            _self._createJumper(0);
            window.location.reload();
        })
    },
    init:function(guiControls){
        this.renderer = new THREE.WebGLRenderer({antialias:guiControls.antialiasVal});
        
        var _self = this;
        this.conf.gui = guiControls;
        //场景渲染初始化
        this.setScene();
        
        var Bricks = new THREE.Group();
        //create BigLu
        function Biglu(i,j){
            this.num = _self.songArr[j];
            //_self.songArr.splice(0,1);
            this.i = i;
            this.j = j;
        }
        Biglu.prototype.creat = function(){
            var newBrick = new Brick(i,_self.songArr[0],_self.conf.roadColor,5);
            _self.cubes.push(newBrick);
            _self.scene.add(newBrick);
            newBrick.position.z = -i*5.05;
            newBrick.position.x = _self.cubes[i].position.x;
            //nextDir = -nextDir;
        }
        function SumArr(arr){
            var Sum = 0;
            for(var i= arr.length-1;i>=0;i--){
                Sum +=arr[i]
            }
            return Sum;
        }
        var  allSum = SumArr(_self.songArr);
        
        var roadItems = this.songArr.length;
        var count =0;
        for(let j = 0;j<this.songArr.length;j++){
            let roadItem = this.songArr[j];
            var preroadItem = this.songArr[j-1];
            let Num = j % 2;
            if(Num ===1){
                _self.cubeStat.nextDir = "left"
            }else{
                _self.cubeStat.nextDir = "right"
            }
            var colorNum = Math.floor(Math.random()*20);
            var colorRandom = {
                r:colorNum+140,
                g:colorNum+150,
                b:colorNum+150
            }
            let boxColor = new THREE.Color("rgb("+colorRandom.r+", "+colorRandom.g+", "+colorRandom.b+")");
            console.log(boxColor)
            let nextDir = _self.cubeStat.nextDir;
            for (let i=0;i<roadItem;i++) {
                count++;
                setTimeout(function(){
                    _self.createCube(nextDir,boxColor,_self.conf.cubeSize);
                },count*100);
                
            }
        }
        function start(vector){
            // let h = 0;
            // let t = setInterval(function(){
            //     _self._createJumper(h,dir);
            //     h++
            //     if(h == 10){
            //         clearInterval(t)
            //     }
            // },100);
            
        }
        
        var interaction = new THREE.Interaction(this.renderer, this.scene, this.camera);
        let vector = 1;
        var btnStart = document.getElementById("btn_start");
        
        btnStart.addEventListener("click",function(){
            this.parentElement.remove();
            _self._createJumper();
        })

        this.scene.on("pointerdown",function(ev){
            vector = -vector;
            console.log(vector,ev);
            //start(vector);
            var count =0;
            for (let i=0;i<30;i++) {
                count++;
                setTimeout(function(){
                    _self._createJumper(count,vector);
                },count*100); 
            }
            
        })

        this.setLight();
        this._render();
        this.setCamera();
        //辅助工具
        this._Helpers();
    },
    _createJumper: function(i,nextDir) {
        var _self = this;
        var material = new THREE.MeshLambertMaterial({ color: this.conf.jumperColor })
        var geometry = new THREE.CubeGeometry(this.conf.jumperWidth, this.conf.jumperHeight, this.conf.jumperDeep)
        geometry.translate(0, 2.5, 0)
        var mesh = new THREE.Mesh(geometry, material);
        
        var prev_Index = this.jumpers.length;
        if(prev_Index >0){
            if (nextDir === 1) {
                mesh.position.x = _self.jumpers[prev_Index -1].position.x;
                mesh.position.z = _self.jumpers[prev_Index -1].position.z;
                new TWEEN.Tween( mesh.position ).to( {
                    x: _self.jumpers[prev_Index -1].position.x -2,
                    z:_self.jumpers[prev_Index -1].position.z
                }, 50 )
                .easing( TWEEN.Easing.Linear.None).start();
                // mesh.position.x = _self.jumpers[prev_Index -1].position.x -2.1;
                // mesh.position.z = _self.jumpers[prev_Index -1].position.z;
            } else {
                mesh.position.x = _self.jumpers[prev_Index -1].position.x;
                mesh.position.z = _self.jumpers[prev_Index -1].position.z;
                new TWEEN.Tween( mesh.position ).to( {
                    x: _self.jumpers[prev_Index -1].position.x,
                    z:_self.jumpers[prev_Index -1].position.z-2
                }, 50 )
                .easing( TWEEN.Easing.Linear.None).start();
                // mesh.position.x = _self.jumpers[prev_Index -1].position.x;
                // mesh.position.z = _self.jumpers[prev_Index -1].position.z-2.1;
            }
            
        }
        if(prev_Index>2){
            this._updateCameraPos();
            this._updateCamera();
        }
        //console.log(_self.jumpers[prev_Index].position.x,_self.jumpers[prev_Index -1].position.z)
        this.jumpers.push(mesh)
        this.scene.add(mesh);
    },
    createCube:function(nextDir,boxColor,size){
        var _self = this;
        
        // var texture  = new THREE.TextureLoader().load('assets/images/tt1.jpg');
        // var material = new THREE.MeshBasicMaterial({map:texture});
        var materialColor = new THREE.MeshLambertMaterial({ color: boxColor })
        var geometry = new THREE.BoxGeometry(size, this.conf.cubeHeight, size,1,1,1);
        var mesh     = new THREE.Mesh(geometry,materialColor);
        
        mesh.castShadow = true;
        mesh.scale.set( 0.01, 0.01, 0.01 );
        new TWEEN.Tween( mesh.scale ).to( {
            x: 1,
            y:1,
            z:1
        }, 200 )
        .easing( TWEEN.Easing.Cubic.Out).start();
        if (this.roadsGroup.children.length >0) {
            var prevIndex = this.roadsGroup.children.length;
            // var random = Math.random()
            // this.cubeStat.nextDir = random > 0.5 ? 'left' : 'right';
            if (nextDir === 'left') {
                mesh.position.x = this.roadsGroup.children[prevIndex - 1].position.x - this.conf.cubeWidth;
                mesh.position.z = this.roadsGroup.children[prevIndex - 1].position.z;
            } else {
                mesh.position.x = this.roadsGroup.children[prevIndex - 1].position.x
                mesh.position.z = this.roadsGroup.children[prevIndex - 1].position.z - this.conf.cubeWidth
            }
        }
        this.roadsGroup.add(mesh)
        console.log(this.roadsGroup.children.length);
        this.scene.add(this.roadsGroup);
        
        //bigluwhere=-bigluwhere;//置负，下次的大路会和本次相反

        // 当方块数大于6时，删除前面的方块，因为不会出现在画布中
        if(this.roadsGroup.children.length >10){
            //this.scene.remove(this.roadsGroup.children.shift())
        }

        function cubeRender(){
            requestAnimationFrame(cubeRender);
            mesh.rotation.z +=_self.conf.gui.rotationZ;
            TWEEN.update();
            _self.renderer.render(_self.scene,_self.camera);
        }
        cubeRender();
    },
    setLight:function(){
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(3, 10, 5)
        this.scene.add(directionalLight)

        var light = new THREE.AmbientLight(0xffffff, 0.3)
        this.scene.add(light);

        // var lightHelper = new THREE.SpotLightHelper( directionalLight );
        // this.scene.add( lightHelper );
        // var shadowCameraHelper = new THREE.CameraHelper( directionalLight.shadow.camera );
        // this.scene.add( shadowCameraHelper );
    },
    _render:function(){
        this.renderer.render(this.scene,this.camera);
    },
    // _anime:function(){
    //     requestAnimationFrame(this._anime());
    //     // cube.rotation.x +=0.01;
    //     // cube.rotation.y +=0.01;
    //     // cube.rotation.z +=0.01;
    // },
    setCamera:function(){
        //console.log(this.camera)
        this.camera.position.set(30,100,30);
        this.camera.lookAt(this.cameraPos.current)
    },
    _updateCameraPos: function() {
        var _self = this;
        var pointA,pointB,pointR;
        var lastIndex = _self.jumpers.length;
        if(lastIndex>1){
            pointA = {
                x: _self.jumpers[lastIndex - 1].position.x,
                z: _self.jumpers[lastIndex - 1].position.z
            }
            pointB = {
                x: _self.jumpers[lastIndex - 1].position.x,
                z: _self.jumpers[lastIndex - 1].position.z
            }
        }
        
        pointR = new THREE.Vector3();
        pointR.x = (pointA.x + pointB.x) / 2;
        pointR.z = (pointA.z + pointB.z) / 2;

        this.cameraPos.next = pointR;
        
    },
    // 基于更新后的摄像机位置，重新设置摄像机坐标
    _updateCamera: function() {
        var self = this
        var c = {
            x: self.cameraPos.current.x,
            y: self.cameraPos.current.y,
            z: self.cameraPos.current.z
        }
        var n = {
            x: self.cameraPos.next.x,
            y: self.cameraPos.next.y,
            z: self.cameraPos.next.z
        }
       
        
        if (c.x > n.x || c.z > n.z) {
            self.cameraPos.current.x -= 0.1
            self.cameraPos.current.z -= 0.1
            if (self.cameraPos.current.x - self.cameraPos.next.x < 0.05) {
                self.cameraPos.current.x = self.cameraPos.next.x
            }
            if (self.cameraPos.current.z - self.cameraPos.next.z < 0.05) {
                self.cameraPos.current.z = self.cameraPos.next.z
            }
            //self.camera.lookAt(new THREE.Vector3(c.x, 0, c.z))
            console.log(self.camera)
            self.camera.lookAt(new THREE.Vector3(c.x, 0, c.z))
            this.camera.position.set(c.x+30,100,c.z+30);
            
            self._render()
            requestAnimationFrame(function() {
                self._updateCamera()
            })
        }
    },
    setScene:function(){
        this.renderer.setSize(this.screen.width,this.screen.height);
        this.renderer.setClearColor(this.conf.bgColor);
        this.renderer.setPixelRatio( window.devicePixelRatio );
        //this.renderer.shadowMap.enabled = true;
        document.getElementById("gammecanvas").appendChild(this.renderer.domElement);
    },
    _Helpers: function() {
        //辅助网格
        var helper = new THREE.GridHelper( 600, 100 );
        //helper.setColors( 0x0000ff, 0x808080 );
        this.scene.add( helper );       
        var axesHelper = new THREE.AxesHelper(100)
        this.scene.add(axesHelper);

        this.cameraHelper = new THREE.CameraHelper(this.camera);
        this.cameraHelper.visible = true;
        // CONTROLS
        var cameraControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        //cameraControls.addEventListener( 'change', this.render );
        
    }
}

export {Game}