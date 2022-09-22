/**
 * @jest-environment jsdom
 */

 import { DrawCallback, JumpstartCanvas, SetupCallback } from '../jumpstartCanvas'

 /**
  * Ensures that a jumpstart canvas which is set to inactive will not continue to animate,
  * and that calling animateSingleFrame will advance by a single frame of animation.
  */
 test('Manual Animation', () => {
     document.body.innerHTML = 
     "<div style='width:100px; height:100px' id='renderCanvas'>";
     let testWidth: number = -1;
     let testHeight: number = -1;
 
     let bgCanvasFound:boolean = false;
     let drawOk = false;
     let drawCalls = 0;

     function delay(time: number) {
        return new Promise(resolve => setTimeout(resolve, time));
      }
 
     let setup: SetupCallback = (width: number, height: number) => {
         testWidth = width;
         testHeight = height;
     }
 
     let draw: DrawCallback = (width: number, height: number, delta: number, foreCanvas: CanvasRenderingContext2D, midCanvas: CanvasRenderingContext2D, bgCanvas: CanvasRenderingContext2D) => {
         bgCanvas.fillStyle = "green";
         drawCalls += 1;
     }
 
     let jsCanvas = new JumpstartCanvas('renderCanvas', {active: false});
     jsCanvas.onSetup(setup);
     jsCanvas.onDraw(draw);
     //jsCanvas.stop();
 
     window.onload = () => {
         jsCanvas.init();
         jsCanvas.animateSingleFrame();
         delay(2000).then(() => {
            expect(drawCalls).toBe(1);
         });
     }
 
 })