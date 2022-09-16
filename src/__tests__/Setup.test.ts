/**
 * @jest-environment jsdom
 */

import { JumpstartCanvas, SetupCallback } from '../jumpstartCanvas'

test('Setup Test', () => {
    document.body.innerHTML = 
    "<div style='width:100px; height:100px' id='renderCanvas'>";
    let testWidth: number = -1;
    let testHeight: number = -1;

    let setup: SetupCallback = (width: number, height: number) => {
        testWidth = width;
        testHeight = height;
    }

    let jsCanvas = new JumpstartCanvas('renderCanvas', setup, null, null, null, null, null, null);
    jsCanvas.init();

    expect(testWidth).toBeGreaterThan(-1);
    expect(testHeight).toBeGreaterThan(-1);
})