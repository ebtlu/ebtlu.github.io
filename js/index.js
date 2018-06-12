var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DustParticles = function DustParticles() {
    var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

    _classCallCheck(this, DustParticles);

    this.num = num;
    this.wrap = new THREE.Object3D();
    for (var i = 0; i < this.num; i++) {
        var size = getRandomNum(800, 100);
        var geometory = new THREE.BoxGeometry(size, size, size);
        var color = 0xFFA133;
        var material = new THREE.MeshLambertMaterial({
            opacity: 1.0,
            wireframe: false,
            transparent: true,
            color: color
        });
        var mesh = new THREE.Mesh(geometory, material);
        var radius = getRandomNum(13000, 7000);
        var theta = THREE.Math.degToRad(getRandomNum(180));
        var phi = THREE.Math.degToRad(getRandomNum(360));
        mesh.position.x = Math.sin(theta) * Math.cos(phi) * radius;
        mesh.position.y = Math.sin(theta) * Math.sin(phi) * radius;
        mesh.position.z = Math.cos(theta) * radius;
        mesh.rotation.x = getRandomNum(360);
        mesh.rotation.y = getRandomNum(360);
        mesh.rotation.z = getRandomNum(360);
        this.wrap.add(mesh);
    }
};

var BoxContainer = function BoxContainer() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
    var depth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0xffffff;

    _classCallCheck(this, BoxContainer);

    var geometry = new THREE.BoxGeometry(width, height, depth, 10, 10, 10);
    var material = new THREE.MeshLambertMaterial({
        color: color,
        opacity: 1.0,
        wireframe: true,
        depthWrite: false,
        visible: false
    });
    this.mesh = new THREE.Mesh(geometry, material);
};

var Bellwether = function () {
    function Bellwether() {
        _classCallCheck(this, Bellwether);

        var geometry = new THREE.CylinderGeometry(1, 30, 50, 12);
        geometry.rotateX(THREE.Math.degToRad(90));
        var color = new THREE.Color(0xff0000);
        var material = new THREE.MeshLambertMaterial({
            color: color,
            visible: false
        });
        this.mesh = new THREE.Mesh(geometry, material);
        var radius = getRandomNum(1000, 200);
        var theta = THREE.Math.degToRad(getRandomNum(180));
        var phi = THREE.Math.degToRad(getRandomNum(360));
        this.mesh.position.x = Math.sin(theta) * Math.cos(phi) * radius;
        this.mesh.position.y = Math.sin(theta) * Math.sin(phi) * radius;
        this.mesh.position.z = Math.cos(theta) * radius;
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.timeX = getRandomNum(10, 0) * 0.1;
        this.timeY = getRandomNum(10, 0) * 0.1;
        this.timeZ = getRandomNum(10, 0) * 0.1;
        this.maxSpeed = 40;
        this.separateMaxSpeed = 30;
        this.separateMaxForce = 30;
    }

    _createClass(Bellwether, [{
        key: 'applyForce',
        value: function applyForce(f) {
            this.acceleration.add(f.clone());
        }
    }, {
        key: 'update',
        value: function update() {
            var maxSpeed = this.maxSpeed;

            // update velocity
            this.velocity.add(this.acceleration);

            // limit velocity
            if (this.velocity.length() > maxSpeed) {
                this.velocity.clampLength(0, maxSpeed);
            }

            // update position
            this.mesh.position.add(this.velocity);

            // reset acc
            this.acceleration.multiplyScalar(0);

            // head
            var head = this.velocity.clone();
            head.multiplyScalar(10);
            head.add(this.mesh.position);
            this.mesh.lookAt(head);
        }
    }, {
        key: 'randomWalk',
        value: function randomWalk() {
            var acc = new THREE.Vector3();
            this.timeX += this.getRandAddTime();
            this.timeY += this.getRandAddTime();
            this.timeZ += this.getRandAddTime();
            acc.x = Math.cos(this.timeX) * 10;
            acc.y = Math.sin(this.timeY) * 10;
            acc.z = Math.sin(this.timeZ) * 10;
            acc.normalize();
            acc.multiplyScalar(2);
            this.applyForce(acc);
        }
    }, {
        key: 'spiralWalk',
        value: function spiralWalk() {
            this.timeX += 0.12;
            this.timeY += 0.012;
            this.timeZ += 0.0135;
            var baseRadius = 200;

            var acc = new THREE.Vector3();
            var theta1 = Math.cos(this.timeY);
            var theta2 = Math.sin(this.timeY);

            var radius1 = baseRadius * theta1;
            var radius2 = baseRadius * theta2;
            acc.x = Math.cos(this.timeX) * radius1 + Math.cos(this.timeZ) * baseRadius;
            acc.y = Math.cos(this.timeX) * radius2 + Math.sin(this.timeZ) * baseRadius;
            acc.z = Math.sin(this.timeX) * baseRadius;
            this.applyForce(acc);
        }
    }, {
        key: 'getRandAddTime',
        value: function getRandAddTime() {
            var randNum = getRandomNum(100, 0);
            var time = 0;
            if (randNum > 97) {
                time = getRandomNum(100, 0) * 0.01;
                if (getRandomNum(10) > 5) {
                    time *= -1;
                }
            } else {
                time = 0.01;
            }
            return time;
        }
    }, {
        key: 'getAvoidVector',
        value: function getAvoidVector() {
            var wall = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Vector3();

            this.mesh.geometry.computeBoundingSphere();
            var boundingSphere = this.mesh.geometry.boundingSphere;

            var toMeVector = new THREE.Vector3();
            toMeVector.subVectors(this.mesh.position, wall);

            var distance = toMeVector.length() - boundingSphere.radius * 2;
            var steerVector = toMeVector.clone();
            steerVector.normalize();
            steerVector.multiplyScalar(1 / Math.pow(distance, 2));
            return steerVector;
        }
    }, {
        key: 'avoidBoxContainer',
        value: function avoidBoxContainer() {
            var rangeWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 80;
            var rangeHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 80;
            var rangeDepth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 80;

            var sumVector = new THREE.Vector3();
            sumVector.add(this.getAvoidVector(new THREE.Vector3(rangeWidth, this.mesh.position.y, this.mesh.position.z)));
            sumVector.add(this.getAvoidVector(new THREE.Vector3(-rangeWidth, this.mesh.position.y, this.mesh.position.z)));
            sumVector.add(this.getAvoidVector(new THREE.Vector3(this.mesh.position.x, rangeHeight, this.mesh.position.z)));
            sumVector.add(this.getAvoidVector(new THREE.Vector3(this.mesh.position.x, -rangeHeight, this.mesh.position.z)));
            sumVector.add(this.getAvoidVector(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, rangeDepth)));
            sumVector.add(this.getAvoidVector(new THREE.Vector3(this.mesh.position.x, this.mesh.position.y, -rangeDepth)));
            sumVector.multiplyScalar(Math.pow(this.velocity.length(), 4));
            return sumVector;
        }
    }, {
        key: 'avoidDust',
        value: function avoidDust(dusts) {
            var _this = this;

            var sumVector = new THREE.Vector3();
            var cnt = 0;
            var maxSpeed = this.separateMaxSpeed;
            var maxForce = this.separateMaxForce;
            var steerVector = new THREE.Vector3();

            dusts.forEach(function (dust) {
                var effectiveRange = dust.geometry.boundingSphere.radius + 600;
                var dist = _this.mesh.position.distanceTo(dust.position);
                if (dist > 0 && dist < effectiveRange) {
                    var toMeVector = new THREE.Vector3();
                    toMeVector.subVectors(_this.mesh.position, dust.position);
                    toMeVector.normalize();
                    toMeVector.divideScalar(Math.pow(dist, 4));
                    sumVector.add(toMeVector);
                    cnt++;
                }
            });

            if (cnt > 0) {
                sumVector.divideScalar(cnt);
                sumVector.normalize();
                sumVector.multiplyScalar(maxSpeed);

                steerVector.subVectors(sumVector, this.velocity);
                // limit force
                if (steerVector.length() > maxForce) {
                    steerVector.clampLength(0, maxForce);
                }
            }

            return steerVector;
        }
    }]);

    return Bellwether;
}();

var Escaper = function () {
    function Escaper() {
        _classCallCheck(this, Escaper);

        var geometry = new THREE.CylinderGeometry(1, 24, 60, 12);
        geometry.rotateX(THREE.Math.degToRad(90));
        //const color = new THREE.Color(`hsl(${getRandomNum(360)}, 100%, 50%)`);
        var color = new THREE.Color(0x93deff);
        var material = new THREE.MeshLambertMaterial({
            wireframe: false,
            color: color
        });
        this.mesh = new THREE.Mesh(geometry, material);
        var radius = getRandomNum(100);
        var theta = THREE.Math.degToRad(getRandomNum(180));
        var phi = THREE.Math.degToRad(getRandomNum(360));
        this.mesh.position.x = Math.sin(theta) * Math.cos(phi) * radius;
        this.mesh.position.y = Math.sin(theta) * Math.sin(phi) * radius;
        this.mesh.position.z = Math.cos(theta) * radius;
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.maxSpeed = 40;
        this.seekMaxSpeed = 40;
        this.seekMaxForce = 1.0;
    }

    _createClass(Escaper, [{
        key: 'applyForce',
        value: function applyForce(f) {
            this.acceleration.add(f.clone());
        }
    }, {
        key: 'update',
        value: function update() {
            var maxSpeed = this.maxSpeed;

            // update velocity
            this.velocity.add(this.acceleration);

            // limit velocity
            if (this.velocity.length() > maxSpeed) {
                this.velocity.clampLength(0, maxSpeed);
            }

            // update position
            this.mesh.position.add(this.velocity);

            // reset acc
            this.acceleration.multiplyScalar(0);

            // head
            var head = this.velocity.clone();
            head.multiplyScalar(10);
            head.add(this.mesh.position);
            this.mesh.lookAt(head);
        }
    }, {
        key: 'seek',
        value: function seek() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Vector3();

            var maxSpeed = this.seekMaxSpeed;
            var maxForce = this.seekMaxForce;
            var toGoalVector = new THREE.Vector3();
            toGoalVector.subVectors(target, this.mesh.position);
            var distance = toGoalVector.length();
            toGoalVector.normalize();
            toGoalVector.multiplyScalar(maxSpeed);
            var steerVector = new THREE.Vector3();
            steerVector.subVectors(toGoalVector, this.velocity);
            // limit force
            if (steerVector.length() > maxForce) {
                steerVector.clampLength(0, maxForce);
            }
            return steerVector;
        }
    }]);

    return Escaper;
}();

var Chaser = function () {
    function Chaser() {
        _classCallCheck(this, Chaser);

        var geometry = new THREE.CylinderGeometry(1, 10, 50, 12);
        geometry.rotateX(THREE.Math.degToRad(90));
        var color = new THREE.Color('hsl(' + getRandomNum(360) + ', ' + 0 + '%, ' + getRandomNum(100, 15) + '%)');
        var material = new THREE.MeshLambertMaterial({
            wireframe: false,
            color: color
        });
        this.mesh = new THREE.Mesh(geometry, material);
        var radius = 1000;
        var theta = THREE.Math.degToRad(getRandomNum(180));
        var phi = THREE.Math.degToRad(getRandomNum(360));
        this.mesh.position.x = Math.sin(theta) * Math.cos(phi) * radius;
        this.mesh.position.y = Math.sin(theta) * Math.sin(phi) * radius;
        this.mesh.position.z = Math.cos(theta) * radius;
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.maxSpeed = 50;
        this.seekMaxSpeed = getRandomNum(50, 35);
        this.seekMaxForce = getRandomNum(20, 10) * 0.1;
        this.separateMaxSpeed = getRandomNum(120, 100);
        this.separateMaxForce = getRandomNum(70, 30) * 0.1;
    }

    _createClass(Chaser, [{
        key: 'applyForce',
        value: function applyForce(f) {
            this.acceleration.add(f.clone());
        }
    }, {
        key: 'update',
        value: function update() {
            var maxSpeed = this.maxSpeed;

            // update velocity
            this.velocity.add(this.acceleration);

            // limit velocity
            if (this.velocity.length() > maxSpeed) {
                this.velocity.clampLength(0, maxSpeed);
            }

            // update position
            this.mesh.position.add(this.velocity);

            // reset acc
            this.acceleration.multiplyScalar(0);

            // head
            var head = this.velocity.clone();
            head.multiplyScalar(10);
            head.add(this.mesh.position);
            this.mesh.lookAt(head);
        }
    }, {
        key: 'seek',
        value: function seek() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Vector3();

            var maxSpeed = this.seekMaxSpeed;
            var maxForce = this.seekMaxForce;
            var toGoalVector = new THREE.Vector3();
            toGoalVector.subVectors(target, this.mesh.position);
            toGoalVector.normalize();
            toGoalVector.multiplyScalar(maxSpeed);
            var steerVector = new THREE.Vector3();
            steerVector.subVectors(toGoalVector, this.velocity);
            // limit force
            if (steerVector.length() > maxForce) {
                steerVector.clampLength(0, maxForce);
            }
            return steerVector;
        }
    }, {
        key: 'separate',
        value: function separate(creatures) {
            var _this2 = this;

            var sumVector = new THREE.Vector3();
            var cnt = 0;
            var maxSpeed = this.separateMaxSpeed;
            var maxForce = this.separateMaxForce;
            var effectiveRange = 30;
            var steerVector = new THREE.Vector3();

            creatures.forEach(function (creature) {
                var dist = _this2.mesh.position.distanceTo(creature.mesh.position);
                if (dist > 0 && dist < effectiveRange) {
                    var toMeVector = new THREE.Vector3();
                    toMeVector.subVectors(_this2.mesh.position, creature.mesh.position);
                    toMeVector.normalize();
                    toMeVector.divideScalar(Math.pow(dist, 2));
                    sumVector.add(toMeVector);
                    cnt++;
                }
            });

            if (cnt > 0) {
                sumVector.divideScalar(cnt);
                sumVector.normalize();
                sumVector.multiplyScalar(maxSpeed);

                steerVector.subVectors(sumVector, this.velocity);
                // limit force
                if (steerVector.length() > maxForce) {
                    steerVector.clampLength(0, maxForce);
                }
            }

            return steerVector;
        }
    }]);

    return Chaser;
}();

var ChaseCamera = function () {
    function ChaseCamera() {
        _classCallCheck(this, ChaseCamera);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
        var radius = getRandomNum(2000);
        var theta = THREE.Math.degToRad(getRandomNum(180));
        var phi = THREE.Math.degToRad(getRandomNum(360));
        this.camera.position.x = Math.sin(theta) * Math.cos(phi) * radius;
        this.camera.position.y = Math.sin(theta) * Math.sin(phi) * radius;
        this.camera.position.z = Math.cos(theta) * radius;
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.maxSpeed = 40;
        this.seekMaxSpeed = 40;
        this.seekMaxForce = 4.0;
        this.time = getRandomNum(50) * 0.1;
        this.cameraWorkType = null;
        this.cameraDistanceMax = 2500;
        this.cameraDistanceMin = 200;
        this.cameraDistance = getRandomNum(this.cameraDistanceMax);
    }

    _createClass(ChaseCamera, [{
        key: 'applyForce',
        value: function applyForce(f) {
            this.acceleration.add(f.clone());
        }
    }, {
        key: 'update',
        value: function update() {
            var maxSpeed = this.maxSpeed;

            // update velocity
            this.velocity.add(this.acceleration);

            // limit velocity
            if (this.velocity.length() > maxSpeed) {
                this.velocity.clampLength(0, maxSpeed);
            }

            // update position
            this.camera.position.add(this.velocity);

            // reset acc
            this.acceleration.multiplyScalar(0);
        }
    }, {
        key: 'seek',
        value: function seek() {
            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new THREE.Vector3();

            var maxSpeed = this.seekMaxSpeed;
            var maxForce = this.seekMaxForce;
            var toGoalVector = new THREE.Vector3();
            toGoalVector.subVectors(target, this.camera.position);
            var distance = toGoalVector.length();
            toGoalVector.normalize();
            toGoalVector.multiplyScalar(maxSpeed);
            var steerVector = new THREE.Vector3();
            steerVector.subVectors(toGoalVector, this.velocity);
            // limit force
            if (steerVector.length() > maxForce) {
                steerVector.clampLength(0, maxForce);
            }
            return steerVector;
        }
    }, {
        key: 'lookingZoomInOut',
        value: function lookingZoomInOut(target, type) {
            if (type !== this.cameraWorkType) this.cameraWorkType = 'zoomInOut';
            var targetPos = target.mesh.position.clone();
            this.time += 0.01;
            this.time -= this.cameraDistance * 0.0000023;
            this.cameraDistance = this.cameraDistanceMax * Math.abs(Math.pow(Math.sin(this.time), 10)) + this.cameraDistanceMin;
            this.camera.position.x = targetPos.x;
            this.camera.position.y = targetPos.y;
            this.camera.position.z = targetPos.z + this.cameraDistance;
        }
    }, {
        key: 'lookingAsChase',
        value: function lookingAsChase(target, type) {
            var cameraTarget = new THREE.Vector3();
            var offsetTargetPos = target.velocity.clone();
            var escaperPos = target.mesh.position.clone();

            if (type === 'front') {
                offsetTargetPos.multiplyScalar(15);
                cameraTarget.addVectors(target.mesh.position, offsetTargetPos);
                this.setChasePosition(type, cameraTarget);
            } else if (type === 'back') {
                offsetTargetPos.multiplyScalar(-20);
                cameraTarget.addVectors(target.mesh.position, offsetTargetPos);
                this.setChasePosition(type, cameraTarget);
            }

            var seek = this.seek(cameraTarget);
            this.applyForce(seek);
        }
    }, {
        key: 'setChasePosition',
        value: function setChasePosition(type, cameraTarget) {
            if (type !== this.cameraWorkType) {
                this.cameraWorkType = type;
                this.camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);
                this.velocity = new THREE.Vector3();
            }
        }
    }]);

    return ChaseCamera;
}();

var gui = new dat.GUI();
var guiControls = new function () {
    this.cameraWork = 'zoomInOut';
}();
gui.add(guiControls, 'cameraWork', ['zoomInOut', 'front', 'back']).onChange(function (e) {
    currentCameraWork = e;
});

var colorPalette = {
    screenBg: 0xf1f1f1,
    ambientLight: 0x777777,
    directionalLight: 0xffffff
};

var getRandomNum = function getRandomNum() {
    var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return Math.floor(Math.random() * (max + 1 - min)) + min;
};
var chasers = [];
var chaserGroup = void 0;
var offsetPhase = getRandomNum(100, 0);
currentCameraWork = 'zoomInOut';

var render = function render() {

    /* bellwether
    ------------------------------------ */
    bellwether.randomWalk();
    // avoid wall
    bellwether.applyForce(bellwether.avoidBoxContainer(boxContainer.mesh.geometry.parameters.width / 2, boxContainer.mesh.geometry.parameters.height / 2, boxContainer.mesh.geometry.parameters.depth / 2));
    // avoid dust
    bellwether.applyForce(bellwether.avoidDust(dustParticles.wrap.children));
    //bellwether.spiralWalk();
    bellwether.update();

    /* escaper
    ------------------------------------ */
    var steer = escaper.seek(bellwether.mesh.position);
    escaper.applyForce(steer);
    escaper.update();

    /* chasers
    ------------------------------------ */
    var offsetTarget1 = escaper.velocity.clone();
    var target = new THREE.Vector3();
    offsetTarget1.normalize();
    offsetPhase += 0.01;
    var offsetDistance = 200 * Math.abs(Math.sin(offsetPhase)) + 100;
    //let offsetDistance = 200;
    offsetTarget1.multiplyScalar(offsetDistance);
    target.subVectors(escaper.mesh.position, offsetTarget1);

    chasers.forEach(function (chaser) {
        var seek = chaser.seek(target);
        chaser.applyForce(seek);
        var separate1 = chaser.separate(chasers);
        chaser.applyForce(separate1);
        chaser.update();
    });

    /* camera
    ------------------------------------ */
    if (currentCameraWork === 'zoomInOut') {
        chaseCamera.lookingZoomInOut(escaper, currentCameraWork);
    } else {
        chaseCamera.lookingAsChase(escaper, currentCameraWork);
        chaseCamera.update();
    }
    chaseCamera.camera.lookAt(escaper.mesh.position);

    /* renderer
    ------------------------------------ */
    renderer.render(scene, chaseCamera.camera);
    requestAnimationFrame(render);
};

var onResize = function onResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    chaseCamera.camera.aspect = width / height;
    chaseCamera.camera.updateProjectionMatrix();
};

/* scene
-------------------------------------------------------------*/
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(colorPalette.screenBg, 1200, 20000);

/* box for border
-------------------------------------------------------------*/
var boxContainer = new BoxContainer(20000, 20000, 20000);
scene.add(boxContainer.mesh);

/* bellwether
-------------------------------------------------------------*/
var bellwether = new Bellwether();
scene.add(bellwether.mesh);

/* escaper
-------------------------------------------------------------*/
var escaper = new Escaper();
escaper.mesh.geometry.computeBoundingSphere();
scene.add(escaper.mesh);

/* chaser
-------------------------------------------------------------*/
chaserGroup = new THREE.Group();
for (var i = 0; i < 300; i++) {
    var chaser = new Chaser();
    chaser.mesh.geometry.computeBoundingSphere();
    chasers.push(chaser);
    chaserGroup.add(chaser.mesh);
}
scene.add(chaserGroup);

/* dustParticles
-------------------------------------------------------------*/
var dustParticles = new DustParticles(150);
dustParticles.wrap.children.forEach(function (dust) {
    dust.geometry.computeBoundingSphere();
});
scene.add(dustParticles.wrap);

/* camera
-------------------------------------------------------------*/
var chaseCamera = new ChaseCamera();
scene.add(chaseCamera.camera);

/* renderer
-------------------------------------------------------------*/
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new THREE.Color(colorPalette.screenBg));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

/* AmbientLight
-------------------------------------------------------------*/
var ambientLight = new THREE.AmbientLight(colorPalette.ambientLight);
ambientLight.intensity = 1.0;
scene.add(ambientLight);

/* DirectionalLight
-------------------------------------------------------------*/
var directionalLight = new THREE.DirectionalLight(colorPalette.directionalLight, 1.0);
directionalLight.position.set(20000, 20000, 2000);
scene.add(directionalLight);

/* resize
-------------------------------------------------------------*/
window.addEventListener('resize', onResize);

/* rendering start
-------------------------------------------------------------*/
document.getElementById('WebGL-output').appendChild(renderer.domElement);
render();