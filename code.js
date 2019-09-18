var visualizationCanvas;
var gl;
var shaderProgram;
var indicesLength;
var timeLocation;
var positionLocation;

$(document).ready(function () {
    visualizationCanvas = document.getElementById("visualization");

    var vertCode = $("#vertexShader").html();
    var fragCode = $("#fragmentShader").html();

    download("libs/simplex.glsl", function (simplex) {
        initWebGL(
            vertCode.replace('#include<libs/noise>', simplex),
            fragCode.replace('#include<libs/noise>', simplex)
        );
        initScene();
        loop(0);
    });

});

function initScene() {
    // get shader locations
    positionLocation = gl.getAttribLocation(shaderProgram, "position");
    timeLocation = gl.getUniformLocation(shaderProgram, "time");
    var samplerLocation = gl.getUniformLocation(shaderProgram, "sampler");

    gl.useProgram(shaderProgram);

    // initialize shader variables

    // init vertices and indices
    var vertices = [];
    var indices = [];
    var length = 2;

    vertices.push(0);
    vertices.push(0);
    vertices.push(0);
    vertices.push(1);
    vertices.push(1);
    vertices.push(0);
    vertices.push(1);
    vertices.push(1);

    indices.push(0);
    indices.push(1);
    indices.push(2);
    indices.push(3);
    indices.push(2);
    indices.push(1);


    console.log(vertices);

    // create vertex buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    // create index buffer
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    indicesLength = indices.length;

    loadImage('grass.png', samplerLocation, gl.TEXTURE0, 0, function () {
        loadImage('sand.png', samplerLocation, gl.TEXTURE1, 1, function () {
            
        });
    });
}

function loadImage(src, location, index, i, callback) {
    console.log(src, location, index, i);
    const texture = gl.createTexture();
    this.img = new Image();
    this.img.onload = function () {
        gl.activeTexture(index);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(location, i);
        callback();
    };
    this.img.src = src;
    return texture;
}

function initWebGL(vertexShaderCode, fragmentShaderCode) {
    gl = visualizationCanvas.getContext('experimental-webgl');

    // compile vertex shader
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertexShaderCode);
    gl.compileShader(vertShader);
    var err1 = gl.getShaderInfoLog(vertShader);
    if (err1) {
        alert(err1);
    }

    // compile fragment shader
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragmentShaderCode);
    gl.compileShader(fragShader);
    var err2 = gl.getShaderInfoLog(fragShader);
    if (err2) {
        alert(err2);
    }

    // link shaders
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
}

function draw(time) {
    drawVisualization(time);
}

function drawVisualization(time) {
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clearDepth(1.0);

    gl.viewport(0.0, 0.0, visualizationCanvas.width, visualizationCanvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(timeLocation, time);

    gl.drawElements(gl.TRIANGLES, indicesLength, gl.UNSIGNED_SHORT, 0);
}
