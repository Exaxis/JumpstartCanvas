/**
 * @jest-environment jsdom
 */

import { DrawCallback, JumpstartCanvas, SetupCallback } from '../jumpstartCanvas'

/**
 * Ensures that a jumpstart canvas will be correctly set up and working with a basic configuration
 */

test('Setup Test', () => {
    document.body.innerHTML = 
    "<div style='width:100px; height:100px' id='renderCanvas'>";
    let testWidth: number = -1;
    let testHeight: number = -1;

    let drawOk = false;

    let setup: SetupCallback = (width: number, height: number) => {
        testWidth = width;
        testHeight = height;
    }

    let draw: DrawCallback = (width: number, height: number, delta: number, foreCanvas: CanvasRenderingContext2D, midCanvas: CanvasRenderingContext2D, bgCanvas: CanvasRenderingContext2D) => {
        bgCanvas.fillStyle = "green";
        drawOk = true;
    }

    let jsCanvas = new JumpstartCanvas('renderCanvas');
    jsCanvas.onSetup(setup);
    jsCanvas.onDraw(draw);

    window.onload = () => {
        jsCanvas.init();
        expect(testWidth).toBeGreaterThan(-1);
        expect(testHeight).toBeGreaterThan(-1);
        expect(drawOk).toBeTruthy();
    }

})