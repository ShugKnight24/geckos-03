'use strict';

/*
 * The socket.io script in the html file exposes
 * our client side instance of socket via the io()
 * variable
*/

var socket = io();

const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');

// if we want to make the canvas full screen in the future
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

ctx.strokeStyle = '#000000';
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.lineWidth = 10;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

function draw(event, line){

    // Stop drawing if not clicking mouse down
    if (!isDrawing) return;

    ctx.beginPath();

    // Start line from
    ctx.moveTo(lastX, lastY);

    // End line
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();

    socket.emit('user draw', line);
    [lastX, lastY] = [event.offsetX, event.offsetY];

}

function socketDraw(line){

    ctx.beginPath();

    // Start line from
    ctx.moveTo(line.startX, line.startY);

    // End line
    ctx.lineTo(line.endX, line.endY);
    ctx.stroke();

}

canvas.addEventListener('mousemove', (event) => {

    let line = {
        startX: lastX,
        startY: lastY,
        endX: event.offsetX,
        endY: event.offsetY
    };

    draw(event, line);
});

canvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    [lastX, lastY] = [event.offsetX, event.offsetY];

    let line = {
        startX: lastX,
        startY: lastY,
        endX: event.offsetX,
        endY: event.offsetY
    };

    draw(event, line);
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

/*
 * socket.io part
 */

 socket.on('user draw', line => {
    socketDraw(line);
 });