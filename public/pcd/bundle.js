webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const THREE = __webpack_require__(0);
const OrbitControl = __webpack_require__(2);
OrbitControl(THREE);
const PCDLoader = __webpack_require__(3);
PCDLoader(THREE);
const readFile_1 = __webpack_require__(4);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
const loader = new THREE.PCDLoader();
const pathPoints = [];
const MAX_POINTS = 500;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(MAX_POINTS * 3);
geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setDrawRange(0, pathPoints.length);
const material = new THREE.LineBasicMaterial({
    color: 0xff0000,
    linewidth: 2
});
const line = new THREE.Line(geometry, material);
scene.add(line);
let fileName = '';
$('#button_input_file').on('change', (event) => {
    const files = event.target.files;
    readFile_1.ReadFile.read(files[0]).then((data) => {
        fileName = files[0].name;
        loader.load(data, fileName, (pointCloud) => {
            if (scene.children.length > 0) {
                for (let i = scene.children.length - 1; i >= 0; i--) {
                    scene.remove(scene.children[i]);
                }
            }
            scene.add(pointCloud);
            const center = pointCloud.geometry.boundingSphere.center;
            controls.target.set(center.x, center.y, center.z);
            const render = function () {
                requestAnimationFrame(render);
                controls.update();
                renderer.render(scene, camera);
            };
            render();
        });
    });
});
renderer.domElement.addEventListener('click', (event) => {
    event.preventDefault();
    const pointCloud = scene.getObjectByName(fileName);
    if (event.shiftKey) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(pointCloud);
        if (intersects.length > 0) {
            const clickPoint = intersects.reduce((a, b) => {
                return (a.distanceToRay < b.distanceToRay) ? a : b;
            }, intersects[0]);
            pointCloud.geometry.attributes.color.array[clickPoint.index * 3] = 1.0;
            pointCloud.geometry.attributes.color.array[clickPoint.index * 3 + 1] = 0.0;
            pointCloud.geometry.attributes.color.array[clickPoint.index * 3 + 2] = 0.0;
            pointCloud.geometry.attributes.color.needsUpdate = true;
            pathPoints.push(clickPoint.point);
            const linePosition = line.geometry.attributes.position.array;
            for (let i = 0, i3 = 0; i < pathPoints.length; i++, i3 += 3) {
                linePosition[i3] = pathPoints[i].x;
                linePosition[i3 + 1] = pathPoints[i].y;
                linePosition[i3 + 2] = pathPoints[i].z;
            }
            line.geometry.setDrawRange(0, pathPoints.length);
            line.geometry.computeBoundingSphere();
            line.geometry.attributes.position.needsUpdate = true;
        }
    }
});
window.addEventListener('keypress', (event) => {
    let index = 0;
    const pointCloud = scene.getObjectByName(fileName);
    switch (event.key || String.fromCharCode(event.keyCode || event.charCode)) {
        case '+':
            pointCloud.material.size *= 1.2;
            pointCloud.material.needsUpdate = true;
            break;
        case '-':
            pointCloud.material.size /= 1.2;
            pointCloud.material.needsUpdate = true;
            break;
        case 'c':
            for (let i = 0; i < pointCloud.PCDheader.points; i++) {
                const intensity = pointCloud.geometry.attributes.intensity.array[i];
                const normalizeIntensity = intensity / 100;
                const color = new THREE.Color();
                color.setHSL(normalizeIntensity * 0.75, 0.8, 0.5);
                pointCloud.geometry.attributes.color.array[index++] = color.r;
                pointCloud.geometry.attributes.color.array[index++] = color.g;
                pointCloud.geometry.attributes.color.array[index++] = color.b;
            }
            pointCloud.geometry.attributes.color.needsUpdate = true;
            break;
        case 'g':
            for (let i = 0; i < pointCloud.PCDheader.points; i++) {
                const intensity = pointCloud.geometry.attributes.intensity.array[i];
                const normalizeIntensity = intensity / 100;
                pointCloud.geometry.attributes.color.array[index++] = normalizeIntensity + 0.2;
                pointCloud.geometry.attributes.color.array[index++] = normalizeIntensity + 0.2;
                pointCloud.geometry.attributes.color.array[index++] = normalizeIntensity + 0.2;
            }
            pointCloud.geometry.attributes.color.needsUpdate = true;
            break;
    }
});
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(THREE) {
	THREE.OrbitControls = function ( object, domElement, localElement ) {
 
		this.object = object;
		this.domElement = ( domElement !== undefined ) ? domElement : document;
		this.localElement = ( localElement !== undefined ) ? localElement : document;
	
		// API
	
		// Set to false to disable this control
		this.enabled = true;
	
		// "target" sets the location of focus, where the control orbits around
		// and where it pans with respect to.
		this.target = new THREE.Vector3();
		// center is old, deprecated; use "target" instead
		this.center = this.target;
	
		// This option actually enables dollying in and out; left as "zoom" for
		// backwards compatibility
		this.noZoom = false;
		this.zoomSpeed = 1.0;
		// Limits to how far you can dolly in and out
		this.minDistance = 0;
		this.maxDistance = Infinity;
	
		// Set to true to disable this control
		this.noRotate = false;
		this.rotateSpeed = 1.0;
	
		// Set to true to disable this control
		this.noPan = false;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push
	
		// Set to true to automatically rotate around the target
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60
	
		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians
	
		// Set to true to disable use of the keys
		this.noKeys = false;
		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };
	
		////////////
		// internals
	
		var scope = this;
	
		var EPS = 0.000001;
	
		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();
	
		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();
	
		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();
	
		var phiDelta = 0;
		var thetaDelta = 0;
		var scale = 1;
		var pan = new THREE.Vector3();
	
		var lastPosition = new THREE.Vector3();
	
		var STATE = { NONE : -1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };
		var state = STATE.NONE;
	
		// events
	
		var changeEvent = { type: 'change' };
	
	
		this.rotateLeft = function ( angle ) {
	
			if ( angle === undefined ) {
	
				angle = getAutoRotationAngle();
	
			}
	
			thetaDelta -= angle;
	
		};
	
		this.rotateUp = function ( angle ) {
	
			if ( angle === undefined ) {
	
				angle = getAutoRotationAngle();
	
			}
	
			phiDelta -= angle;
	
		};
	
		// pass in distance in world space to move left
		this.panLeft = function ( distance ) {
	
			var panOffset = new THREE.Vector3();
			var te = this.object.matrix.elements;
			// get X column of matrix
			panOffset.set( te[0], te[1], te[2] );
			panOffset.multiplyScalar(-distance);
			
			pan.add( panOffset );
	
		};
	
		// pass in distance in world space to move up
		this.panUp = function ( distance ) {
	
			var panOffset = new THREE.Vector3();
			var te = this.object.matrix.elements;
			// get Y column of matrix
			panOffset.set( te[4], te[5], te[6] );
			panOffset.multiplyScalar(distance);
			
			pan.add( panOffset );
		};
		
		// main entry point; pass in Vector2 of change desired in pixel space,
		// right and down are positive
		this.pan = function ( delta ) {
	
			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
	
			if ( scope.object.fov !== undefined ) {
	
				// perspective
				var position = scope.object.position;
				var offset = position.clone().sub( scope.target );
				var targetDistance = offset.length();
	
				// half of the fov is center to top of screen
				targetDistance *= Math.tan( (scope.object.fov/2) * Math.PI / 180.0 );
				// we actually don't use screenWidth, since perspective camera is fixed to screen height
				scope.panLeft( 2 * delta.x * targetDistance / element.clientHeight );
				scope.panUp( 2 * delta.y * targetDistance / element.clientHeight );
	
			} else if ( scope.object.top !== undefined ) {
	
				// orthographic
				scope.panLeft( delta.x * (scope.object.right - scope.object.left) / element.clientWidth );
				scope.panUp( delta.y * (scope.object.top - scope.object.bottom) / element.clientHeight );
	
			} else {
	
				// camera neither orthographic or perspective - warn user
				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
	
			}
	
		};
	
		this.dollyIn = function ( dollyScale ) {
	
			if ( dollyScale === undefined ) {
	
				dollyScale = getZoomScale();
	
			}
	
			scale /= dollyScale;
	
		};
	
		this.dollyOut = function ( dollyScale ) {
	
			if ( dollyScale === undefined ) {
	
				dollyScale = getZoomScale();
	
			}
	
			scale *= dollyScale;
	
		};
	
		this.update = function () {
	
			var position = this.object.position;
			var offset = position.clone().sub( this.target );
	
			// angle from z-axis around y-axis
	
			var theta = Math.atan2( offset.x, offset.z );
	
			// angle from y-axis
	
			var phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );
	
			if ( this.autoRotate ) {
	
				this.rotateLeft( getAutoRotationAngle() );
	
			}
	
			theta += thetaDelta;
			phi += phiDelta;
	
			// restrict phi to be between desired limits
			phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );
	
			// restrict phi to be betwee EPS and PI-EPS
			phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );
	
			var radius = offset.length() * scale;
	
			// restrict radius to be between desired limits
			radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );
			
			// move target to panned location
			this.target.add( pan );
	
			offset.x = radius * Math.sin( phi ) * Math.sin( theta );
			offset.y = radius * Math.cos( phi );
			offset.z = radius * Math.sin( phi ) * Math.cos( theta );
	
			position.copy( this.target ).add( offset );
	
			this.object.lookAt( this.target );
	
			thetaDelta = 0;
			phiDelta = 0;
			scale = 1;
			pan.set(0,0,0);
	
			if ( lastPosition.distanceTo( this.object.position ) > 0 ) {
	
				this.dispatchEvent( changeEvent );
	
				lastPosition.copy( this.object.position );
	
			}
	
		};
	
	
		function getAutoRotationAngle() {
	
			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;
	
		}
	
		function getZoomScale() {
	
			return Math.pow( 0.95, scope.zoomSpeed );
	
		}
	
		function onMouseDown( event ) {
	
			if ( scope.enabled === false ) { return; }
			event.preventDefault();
	
			if ( event.button === 0 ) {
				if ( scope.noRotate === true ) { return; }
	
				state = STATE.ROTATE;
	
				rotateStart.set( event.clientX, event.clientY );
	
			} else if ( event.button === 1 ) {
				if ( scope.noZoom === true ) { return; }
	
				state = STATE.DOLLY;
	
				dollyStart.set( event.clientX, event.clientY );
	
			} else if ( event.button === 2 ) {
				if ( scope.noPan === true ) { return; }
	
				state = STATE.PAN;
	
				panStart.set( event.clientX, event.clientY );
	
			}
	
			// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
			scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
			scope.domElement.addEventListener( 'mouseup', onMouseUp, false );
	
		}
	
		function onMouseMove( event ) {
	
			if ( scope.enabled === false ) return;
	
			event.preventDefault();
	
			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
	
			if ( state === STATE.ROTATE ) {
	
				if ( scope.noRotate === true ) return;
	
				rotateEnd.set( event.clientX, event.clientY );
				rotateDelta.subVectors( rotateEnd, rotateStart );
	
				// rotating across whole screen goes 360 degrees around
				scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
				// rotating up and down along whole screen attempts to go 360, but limited to 180
				scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );
	
				rotateStart.copy( rotateEnd );
	
			} else if ( state === STATE.DOLLY ) {
	
				if ( scope.noZoom === true ) return;
	
				dollyEnd.set( event.clientX, event.clientY );
				dollyDelta.subVectors( dollyEnd, dollyStart );
	
				if ( dollyDelta.y > 0 ) {
	
					scope.dollyIn();
	
				} else {
	
					scope.dollyOut();
	
				}
	
				dollyStart.copy( dollyEnd );
	
			} else if ( state === STATE.PAN ) {
	
				if ( scope.noPan === true ) return;
	
				panEnd.set( event.clientX, event.clientY );
				panDelta.subVectors( panEnd, panStart );
				
				scope.pan( panDelta );
	
				panStart.copy( panEnd );
	
			}
	
			// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
			scope.update();
	
		}
	
		function onMouseUp( /* event */ ) {
	
			if ( scope.enabled === false ) return;
	
			// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
			scope.domElement.removeEventListener( 'mousemove', onMouseMove, false );
			scope.domElement.removeEventListener( 'mouseup', onMouseUp, false );
	
			state = STATE.NONE;
	
		}
	
		function onMouseWheel( event ) {
	
			if ( scope.enabled === false || scope.noZoom === true ) return;
	
			var delta = 0;
	
			if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9
	
				delta = event.wheelDelta;
	
			} else if ( event.detail ) { // Firefox
	
				delta = - event.detail;
	
			}
	
			if ( delta > 0 ) {
	
				scope.dollyOut();
	
			} else {
	
				scope.dollyIn();
	
			}
	
		}
	
		function onKeyDown( event ) {
	
			if ( scope.enabled === false ) { return; }
			if ( scope.noKeys === true ) { return; }
			if ( scope.noPan === true ) { return; }
	
			// pan a pixel - I guess for precise positioning?
			// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
			var needUpdate = false;
			
			switch ( event.keyCode ) {
	
				case scope.keys.UP:
					scope.pan( new THREE.Vector2( 0, scope.keyPanSpeed ) );
					needUpdate = true;
					break;
				case scope.keys.BOTTOM:
					scope.pan( new THREE.Vector2( 0, -scope.keyPanSpeed ) );
					needUpdate = true;
					break;
				case scope.keys.LEFT:
					scope.pan( new THREE.Vector2( scope.keyPanSpeed, 0 ) );
					needUpdate = true;
					break;
				case scope.keys.RIGHT:
					scope.pan( new THREE.Vector2( -scope.keyPanSpeed, 0 ) );
					needUpdate = true;
					break;
			}
	
			// Greggman fix: https://github.com/greggman/three.js/commit/fde9f9917d6d8381f06bf22cdff766029d1761be
			if ( needUpdate ) {
	
				scope.update();
	
			}
	
		}
		
		function touchstart( event ) {
	
			if ( scope.enabled === false ) { return; }
	
			switch ( event.touches.length ) {
	
				case 1:	// one-fingered touch: rotate
					if ( scope.noRotate === true ) { return; }
	
					state = STATE.TOUCH_ROTATE;
	
					rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					break;
	
				case 2:	// two-fingered touch: dolly
					if ( scope.noZoom === true ) { return; }
	
					state = STATE.TOUCH_DOLLY;
	
					var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
					var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
					var distance = Math.sqrt( dx * dx + dy * dy );
					dollyStart.set( 0, distance );
					break;
	
				case 3: // three-fingered touch: pan
					if ( scope.noPan === true ) { return; }
	
					state = STATE.TOUCH_PAN;
	
					panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					break;
	
				default:
					state = STATE.NONE;
	
			}
		}
	
		function touchmove( event ) {
	
			if ( scope.enabled === false ) { return; }
	
			event.preventDefault();
			event.stopPropagation();
	
			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;
	
			switch ( event.touches.length ) {
	
				case 1: // one-fingered touch: rotate
					if ( scope.noRotate === true ) { return; }
					if ( state !== STATE.TOUCH_ROTATE ) { return; }
	
					rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					rotateDelta.subVectors( rotateEnd, rotateStart );
	
					// rotating across whole screen goes 360 degrees around
					scope.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
					// rotating up and down along whole screen attempts to go 360, but limited to 180
					scope.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );
	
					rotateStart.copy( rotateEnd );
					break;
	
				case 2: // two-fingered touch: dolly
					if ( scope.noZoom === true ) { return; }
					if ( state !== STATE.TOUCH_DOLLY ) { return; }
	
					var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
					var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
					var distance = Math.sqrt( dx * dx + dy * dy );
	
					dollyEnd.set( 0, distance );
					dollyDelta.subVectors( dollyEnd, dollyStart );
	
					if ( dollyDelta.y > 0 ) {
	
						scope.dollyOut();
	
					} else {
	
						scope.dollyIn();
	
					}
	
					dollyStart.copy( dollyEnd );
					break;
	
				case 3: // three-fingered touch: pan
					if ( scope.noPan === true ) { return; }
					if ( state !== STATE.TOUCH_PAN ) { return; }
	
					panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					panDelta.subVectors( panEnd, panStart );
					
					scope.pan( panDelta );
	
					panStart.copy( panEnd );
					break;
	
				default:
					state = STATE.NONE;
	
			}
	
		}
	
		function touchend( /* event */ ) {
	
			if ( scope.enabled === false ) { return; }
	
			state = STATE.NONE;
		}
	
		this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
		this.localElement.addEventListener( 'mousedown', onMouseDown, false );
		this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
		this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox
	
		this.domElement.addEventListener( 'keydown', onKeyDown, false );
	
		this.localElement.addEventListener( 'touchstart', touchstart, false );
		this.domElement.addEventListener( 'touchend', touchend, false );
		this.domElement.addEventListener( 'touchmove', touchmove, false );
	
	};
	
	THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
}



/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = (THREE) => {
	THREE.PCDLoader = function (manager) {
		this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
		this.littleEndian = true;
	};

	THREE.PCDLoader.prototype = {

		constructor: THREE.PCDLoader,

		load: function (data, fileName, onLoad) {
			var scope = this;
			onLoad(scope.parse(data, fileName));
		},

		binarryToStr: function (data) {

			var text = "";
			var charArray = new Uint8Array(data);
			for (var i = 0; i < data.byteLength; i++) {

				text += String.fromCharCode(charArray[i]);

			}
			return text;

		},

		parseHeader: function (data) {
			var PCDheader = {};
			var result1 = data.search(/[\r\n]DATA\s(\S*)\s/i);
			var result2 = /[\r\n]DATA\s(\S*)\s/i.exec(data.substr(result1 - 1));
			PCDheader.data = result2[1];
			PCDheader.headerLen = result2[0].length + result1;
			PCDheader.str = data.substr(0, PCDheader.headerLen);
			// Remove comments
			PCDheader.str = PCDheader.str.replace(/\#.*/gi, "");
			PCDheader.version = /VERSION (.*)/i.exec(PCDheader.str);
			if (PCDheader.version != null)
				PCDheader.version = parseFloat(PCDheader.version[1]);
			PCDheader.fields = /FIELDS (.*)/i.exec(PCDheader.str);
			if (PCDheader.fields != null)
				PCDheader.fields = PCDheader.fields[1].split(" ");
			PCDheader.size = /SIZE (.*)/i.exec(PCDheader.str);
			if (PCDheader.size != null)
				PCDheader.size = PCDheader.size[1].split(" ").map(function (x) {

					return parseInt(x, 10);

				});
			PCDheader.type = /TYPE (.*)/i.exec(PCDheader.str);
			if (PCDheader.type != null)
				PCDheader.type = PCDheader.type[1].split(" ");
			PCDheader.count = /COUNT (.*)/i.exec(PCDheader.str);
			if (PCDheader.count != null)
				PCDheader.count = PCDheader.count[1].split(" ").map(function (x) {

					return parseInt(x, 10);

				});
			PCDheader.width = /WIDTH (.*)/i.exec(PCDheader.str);
			if (PCDheader.width != null)
				PCDheader.width = parseInt(PCDheader.width[1]);
			PCDheader.height = /HEIGHT (.*)/i.exec(PCDheader.str);
			if (PCDheader.height != null)
				PCDheader.height = parseInt(PCDheader.height[1]);
			PCDheader.viewpoint = /VIEWPOINT (.*)/i.exec(PCDheader.str);
			if (PCDheader.viewpoint != null)
				PCDheader.viewpoint = PCDheader.viewpoint[1];
			PCDheader.points = /POINTS (.*)/i.exec(PCDheader.str);
			if (PCDheader.points != null)
				PCDheader.points = parseInt(PCDheader.points[1], 10);
			if (PCDheader.points == null)
				PCDheader.points = PCDheader.width * PCDheader.height;

			if (PCDheader.count == null) {

				PCDheader.count = [];
				for (var i = 0; i < PCDheader.fields; i++)
					PCDheader.count.push(1);

			}

			PCDheader.offset = {};
			var sizeSum = 0;
			for (var i = 0; i < PCDheader.fields.length; i++) {

				if (PCDheader.data == "ascii") {

					PCDheader.offset[PCDheader.fields[i]] = i;

				} else {

					PCDheader.offset[PCDheader.fields[i]] = sizeSum;
					sizeSum += PCDheader.size[i];

				}

			}
			// For binary only
			PCDheader.rowSize = sizeSum;

			return PCDheader;

		},

		parse: function (data, url) {
			// Parse the header
			// Header is always ascii format
			var PCDheader = this.parseHeader(data);

			// Parse the data
			var position = false;
			if (PCDheader.offset.x != undefined)
				position = new Float32Array(PCDheader.points * 3);
			var color = false;
			var intensity = false;
			if (PCDheader.offset.intensity != undefined) {
				color = new Float32Array(PCDheader.points * 3);
				intensity = new Float32Array(PCDheader.points);
			}

			if (PCDheader.data == "ascii") {
				var offset = PCDheader.offset;
				var pcdData = data.substr(PCDheader.headerLen);
				var lines = pcdData.split('\n');
				var i3 = 0;
				for (var i = 0; i < lines.length; i++, i3 += 3) {

					var line = lines[i].split(" ");
					if (offset.x != undefined) {
						const x = parseFloat(line[offset.x]);
						const y = parseFloat(line[offset.y]);
						const z = parseFloat(line[offset.z]);

						if (!(isNaN(x) || isNaN(y) || isNaN(z))) {
							position[i3 + 0] = x;
							position[i3 + 1] = y;
							position[i3 + 2] = z;
						}
					}

					if (offset.intensity != undefined) {
						const intensityValue = Number(line[offset.intensity]);
						const normaliseIntensity = intensityValue / 100.0;
						color[i3 + 0] = 0.2 + normaliseIntensity;
						color[i3 + 1] = 0.2 + normaliseIntensity;
						color[i3 + 2] = 0.2 + normaliseIntensity;
						intensity[i] = intensityValue;
					}
				}
			}

			var geometry = new THREE.BufferGeometry();
			if (position != false)
				geometry.addAttribute('position', new THREE.BufferAttribute(position, 3));
			if (color != false) {
				geometry.addAttribute('color', new THREE.BufferAttribute(color, 3));
				geometry.addAttribute('intensity', new THREE.BufferAttribute(intensity, 1));
			}
			
			geometry.computeBoundingSphere();

			var material = new THREE.PointsMaterial({
				size: 0.05,
				vertexColors: !(color == false)
			});
			if (color == false)
				material.color.setHex(Math.random() * 0xffffff);

			var pointCloud = new THREE.Points(geometry, material);
			var name = url.split('').reverse().join('');
			name = /([^\/]*)/.exec(name);
			name = name[1].split('').reverse().join('');
			pointCloud.name = name;
			pointCloud.PCDheader = PCDheader;

			return pointCloud;

		}

	};

	return THREE.PCDLoader;
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ReadFile {
    static read(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });
    }
}
exports.ReadFile = ReadFile;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
],[5]);
//# sourceMappingURL=bundle.js.map