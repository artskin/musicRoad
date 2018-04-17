import * as THREE from './libs/three.module.js';


var Game = function(){
    this.conf = {
        bgColor:0xdddddd,
        roadColor:0xffffff,
        playerColor:0x33ccff,
        cubeWidth:5,
        cubeHeight:2,
        cubeDeep:5,
        cubeSize:5,
        jumperColor: 0x33ccff,
        jumperWidth: 1, // jumper宽度
        jumperHeight: 1, // jumper高度
        jumperDeep: 1 // jumper深度
    }
    this.score = 0;
    this.screen = {
        width:360,
        height:640
    }
    this.scene = new THREE.Scene()
    this.cameraPos = {
        current: new THREE.Vector3(0, 0, 0), // 摄像机当前的坐标
        next: new THREE.Vector3() // 摄像机即将要移到的位置
    }
    // this.camera2 = new THREE.OrthographicCamera(
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
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    // this.camera.setViewOffset( 
    //     this.screen.width, 
    //     this.screen.height, 
    //     0, 
    //     0, 
    //     this.screen.width, 
    //     this.screen.height
    // );
    
    this.songArr = [6,9,10,9,9,9,9,9,10,5,9,5,5,5,9,9,4,5,5,5/*20*/,4,4,2,2,2,2,5,1,1,1/*30*/,3,5,5,5,5,5,5,5,5,5/*40*/,5,2,2,2,2,2,2,2,2,2/*50*/,4,4,2,2,2,2,5,2,3,3/*60*/,2,2,2,2,2,4,4,4,4,4/*70*/,4,4,4,4,5,5,5,5,5,5,10,10];
    this.songArr = [4,2,3,5];
    this.cubes = [];
    this.cubeStat = {
        nextDir:"right"
    }
    
};

Game.prototype={
    init:function(){
        var _self = this;
        //场景渲染初始化
        this.setScene();

        // var roadItem = this.songArr[0]
        // console.log(this.songArr.splice(0,1))
        // for (var i=0;i<roadItem;i++) {//循环创建小路块，并且加到所有小路快的数组中
        //     //var newlu = new Lu(i,this.num);//i是为了让每个小路快不重叠，可以排序着显示
        //     console.log(i)
        //     this.createCube(i);
        //     //this.cubes.push(mesh);
        //     //newlu.move();
        // }
        
        var roadItems = this.songArr.length;
        
        for(var j = 0;j<this.songArr.length;j++){
            var roadItem = this.songArr[j];
            var preroadItem = this.songArr[j-1];
            var Num = this.songArr[j] % 2;
            console.log("第"+j+"组:"+roadItem+"个","偶数："+this.songArr[j] % 2)
            if(Num ==1){
                this.cubeStat.nextDir = "left"
            }else{
                this.cubeStat.nextDir = "right"
            }
            var Dir = this.cubeStat.nextDir;

            for (var i=0;i<roadItem;i++) {//循环创建小路块，并且加到所有小路快的数组中
                //var newlu = new Lu(i,this.num);//i是为了让每个小路快不重叠，可以排序着显示
                _self.createCube(Dir,_self.conf.roadColor,_self.conf.cubeSize);
                
                //newlu.move();
            }
        }

        this._createJumper();
        
        this.setLight();
        this._render();
        
        // this._updateCameraPos();
        // this._updateCamera();
        this.setCamera();
        
        //辅助工具
        this._Helpers();
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
    _createJumper: function() {
        var material = new THREE.MeshLambertMaterial({ color: this.conf.jumperColor })
        var geometry = new THREE.CubeGeometry(this.conf.jumperWidth, this.conf.jumperHeight, this.conf.jumperDeep)
        geometry.translate(0, 1, 0)
        var mesh = new THREE.Mesh(geometry, material)
        mesh.position.y = 1
        this.jumper = mesh
        this.scene.add(this.jumper);
    },
    createCube:function(Dir,color,size){
        var _self = this;
        // var texture  = new THREE.TextureLoader().load('assets/images/tt1.jpg');
        // var material = new THREE.MeshBasicMaterial({map:texture});
        var materialColor = new THREE.MeshLambertMaterial({ color: color })
        var geometry = new THREE.BoxGeometry(size, this.conf.cubeHeight, size,1,1,1);
        var mesh     = new THREE.Mesh(geometry,materialColor);
        
        mesh.castShadow = true;
        mesh.scale.set( 0.01, 0.01, 0.01 );
        new TWEEN.Tween( mesh.scale ).to( {
            x: 1,
            y:1,
            z:1
        }, 2000 )
        .easing( TWEEN.Easing.Elastic.Out).start();
        
        console.log(this.cubes);
        if (this.cubes.length >1) {
            var prevIndex = this.cubes.length-1
            console.log("this.cubes.length",this.cubes.length)
            // var random = Math.random()
            // this.cubeStat.nextDir = random > 0.5 ? 'left' : 'right';
            if (this.cubeStat.nextDir === 'left') {
                mesh.position.x = this.cubes[prevIndex - 1].position.x - this.conf.cubeWidth-0.05;
                mesh.position.z = this.cubes[prevIndex - 1].position.z;
            } else {
                mesh.position.x = this.cubes[prevIndex - 1].position.x
                mesh.position.z = this.cubes[prevIndex - 1].position.z - this.conf.cubeWidth-0.05
            }
        }
        
        
        setTimeout(function(){
            _self.cubes.push(mesh)
        },1000)
        
        
        // var tween = new TWEEN.Tween(geometry.parameters)
        // .to({
        //     height:6
        // })
        // .easing( TWEEN.Easing.Elastic.Out)
        // .onUpdate(function() {
        //     console.log(this.height);
        // }).start();
        // var time = 1000;
        
        //bigluwhere=-bigluwhere;//置负，下次的大路会和本次相反

        // 当方块数大于6时，删除前面的方块，因为不会出现在画布中
        // if (this.cubes.length > 6) {
        //     this.scene.remove(this.cubes.shift())
        // }
        //console.log(this.cubes);
        this.scene.add(mesh);
        
        
        function cubeRender(){
            requestAnimationFrame(cubeRender);
            //mesh.rotation.z +=0.01;
            TWEEN.update();
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
    setCamera:function(){
        this.camera.position.set(30,100,20);
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
    },
    setScene:function(){
        this.renderer.setSize(this.screen.width,this.screen.height);
        this.renderer.setClearColor(this.conf.bgColor);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
    },
    _Helpers: function() {
        //辅助网格
        var helper = new THREE.GridHelper( 600, 100 );
        //helper.setColors( 0x0000ff, 0x808080 );
        this.scene.add( helper );       
        var axesHelper = new THREE.AxesHelper(100)
        this.scene.add(axesHelper);
        
    }
}

export {Game}