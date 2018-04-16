import * as THREE from './three.module.js';

var Game = function(){
    this.conf = {
        bgColor:0xdddddd,
        roadColor:0xffffff,
        playerColor:0x33ccff,
        cubeWidth:4,
        cubeHeight:2,
        cubeDeep:4
    }
    this.score = 0;
    this.screen = {
        width:360,
        height:640
    }
    
    this.scene = new THREE.Scene()
    // this.camera = new THREE.OrthographicCamera(
    //     this.screen.width/-40,
    //     this.screen.width/40,
    //     this.screen.height/40,
    //     this.screen.height/-40,
    //     0,
    //     5000
    // )
    this.camera = new THREE.PerspectiveCamera(
        45,
        this.screen.width/this.screen.height,
        1,
        10000
    )
    // this.camera.position.set( 500, 800, 1300 );
    // this.camera.lookAt( new THREE.Vector3() );
    // this.camera.rotation ={
    //     x:"-77°",
    //     y:"-12°",
    //     z:"-45°"
    // }
    this.camera.setViewOffset( 
        this.screen.width, 
        this.screen.height, 
        0, 
        0, 
        this.screen.width, 
        this.screen.height
    );
    this.cameraPos = {
        current: new THREE.Vector3(0, 0, 0), // 摄像机当前的坐标
        next: new THREE.Vector3() // 摄像机即将要移到的位置
    }
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.songArr = [6,9,10,9,9,9,9,9,10,5,9,5,5,5,9,9,4,5,5,5/*20*/,4,4,2,2,2,2,5,1,1,1/*30*/,3,5,5,5,5,5,5,5,5,5/*40*/,5,2,2,2,2,2,2,2,2,2/*50*/,4,4,2,2,2,2,5,2,3,3/*60*/,2,2,2,2,2,4,4,4,4,4/*70*/,4,4,4,4,5,5,5,5,5,5,10,10];
    this.cubes = [];
    this.cubeStat = {
        nextDir:""
    }
};

Game.prototype={
    init:function(){
        //场景渲染初始化
        var _self = this;
        this.renderer.setSize(this.screen.width,this.screen.height);
        this.renderer.setClearColor(this.conf.bgColor);
        document.body.appendChild(this.renderer.domElement);
        
        
        setInterval(function(){
            //_self.createCube();
        },1000)
        this.createCube();
        this.createCube();
        this.setLight();
        this._render();
        
        this._updateCameraPos();
        this._updateCamera();
        this.setCamera();
        
        //辅助工具
        this._Helpers();
    },
    _Helpers: function() {
        //辅助网格
        var helper = new THREE.GridHelper( 400, 100 );
        //helper.setColors( 0x0000ff, 0x808080 );
        this.scene.add( helper );       
        var axesHelper = new THREE.AxesHelper(10)
        this.scene.add(axesHelper)
    },
    _render:function(){
        this.renderer.render(this.scene,this.camera);
    },
    createCube:function(){
        var _self = this;
        var texture  = new THREE.TextureLoader().load('assets/images/tt2.jpg');
        var material = new THREE.MeshBasicMaterial({map:texture});
        var geometry = new THREE.BoxGeometry(this.conf.cubeWidth, this.conf.cubeHeight, this.conf.cubeDeep,1,1,1);
        var brick    = new THREE.Mesh(geometry,material);
        if (this.cubes.length) {
            var random = Math.random()
            this.cubeStat.nextDir = random > 0.5 ? 'left' : 'right';
            if (this.cubeStat.nextDir === 'left') {
                brick.position.x = this.cubes[this.cubes.length - 1].position.x - 4;
            } else {
                brick.position.z = this.cubes[this.cubes.length - 1].position.z - 4
            }
        }
        this.cubes.push(brick)
        // 当方块数大于6时，删除前面的方块，因为不会出现在画布中
        if (this.cubes.length > 6) {
            this.scene.remove(this.cubes.shift())
        }
        //console.log(this.cubes);
        
        this.scene.add(brick);
        //this.camera.position.z = 106;

        function cubeRender(){
            requestAnimationFrame(cubeRender);
            //brick.rotation.z +=0.01;
            _self.renderer.render(_self.scene,_self.camera);
        }
        cubeRender();
    },
    // _anime:function(){
    //     requestAnimationFrame(this._anime());
    //     // cube.rotation.x +=0.01;
    //     // cube.rotation.y +=0.01;
    //     // cube.rotation.z +=0.01;
    // },
    setLight:function(){
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
        directionalLight.position.set(3, 10, 5)
        this.scene.add(directionalLight)

        var light = new THREE.AmbientLight(0xffffff, 0.3)
        this.scene.add(light)
    },
    setCamera:function(){
        this.camera.position.set(45,100,45);
        this.camera.lookAt(this.cameraPos.current)
    },
    _updateCameraPos: function() {
        var lastIndex = this.cubes.length - 1
        var pointA = {
            x: this.cubes[lastIndex].position.x,
            z: this.cubes[lastIndex].position.z
        }
        var pointB = {
            x: this.cubes[lastIndex - 1].position.x,
            z: this.cubes[lastIndex - 1].position.z
        }
        var pointR = new THREE.Vector3()
        pointR.x = (pointA.x + pointB.x) / 2
        pointR.y = 0
        pointR.z = (pointA.z + pointB.z) / 2
        this.cameraPos.next = pointR
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
            self.camera.lookAt(new THREE.Vector3(c.x, 0, c.z))
            self._render()
            requestAnimationFrame(function() {
            self._updateCamera()
            })
        }
    }
}

export {Game}