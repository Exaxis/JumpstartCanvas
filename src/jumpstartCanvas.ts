export type SetupCallback = (width: number, height: number) => void;
export type UpdateCallback = (width: number, height: number, delta: number) => void;
export type DrawCallback = (width: number, height: number, delta:number, foreCtx: CanvasRenderingContext2D, midCtx: CanvasRenderingContext2D, bgCtx: CanvasRenderingContext2D) => void;
export type ResizeCallback = () => void;
export type MouseDownCallback = (x: number, y:number) => void;
export type MouseUpCallback = (x: number, y:number) => void;
export type MouseMoveCallback = (x: number, y:number) => void;

export interface JumpstartConfiguration{
    setup?: SetupCallback;
    update?: UpdateCallback;
    draw?: DrawCallback;
    resize?: ResizeCallback;
    mouseDown?: MouseDownCallback;
    mouseUp?: MouseUpCallback;
    mouseMove?: MouseMoveCallback;
    active?: boolean;
    framerateTarget?: number;
    deltaCap?: number;
}

export class MousePosition{
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }
}

export class JumpstartCanvas{
    //----- Private Members -----
    private _bgCanvas: HTMLCanvasElement;
    private _midCanvas: HTMLCanvasElement;
    private _foreCanvas: HTMLCanvasElement;

    private _width: number;
    private _height: number;

    private _active: boolean;
    private _framerateTarget: number;

    private _id: string;

    // Timing control
    private _then: number;
    private _now: number;
    private _elapsed: number;

    //----- Main Method Callbacks -----
    private _setupHandler: SetupCallback | null;
    private _updateHandler: UpdateCallback | null;
    private _drawHandler: DrawCallback | null;
    private _resizeHandler: ResizeCallback | null;
    private _mouseDownHandler: MouseDownCallback | null;
    private _mouseUpHandler: MouseUpCallback | null;
    private _mouseMoveHandler: MouseMoveCallback | null;

    //----- Public Members -----
    public deltaCap:number;

    //----- Private Methods =====
    
    // Performs one frame of animation, i.e., updating logic and drawing
    private _animate = () => {
        if(this._active){

            this._now = Date.now();
            this._elapsed = this._now - this._then;
            this._elapsed = this._elapsed > this.deltaCap ? this.deltaCap : this._elapsed;

            if(this._framerateTarget > 0){
                if(this._elapsed > (1/(this._framerateTarget/1000))){
                    this._then = this._now - (this._elapsed % (this._framerateTarget/1000));
                    this._update(this._elapsed);
                    this._draw(this._elapsed);
                }
            } else {
                // request another frame
                requestAnimationFrame(this._animate);
                this._then = this._now - (this._elapsed % (this._framerateTarget/1000));
                this._update(this._elapsed);
                this._draw(this._elapsed);
            }
        }
    }

    private _update = (delta: number) => {
        if(this._updateHandler != null){
            this._updateHandler(this._width, this._height, delta);
        }
    }

    private _draw(delta: number){
        if(this._drawHandler != null){
            let foreContext = this._foreCanvas.getContext("2d");
            let midContext = this._midCanvas.getContext("2d");
            let bgContext = this._bgCanvas.getContext("2d");

            if(foreContext != null && midContext != null && bgContext != null){
                this._drawHandler(this._width, this._height, delta, foreContext, midContext, bgContext)
            }
        }
    }

    private _resize(){
        this._bgCanvas.width = this._bgCanvas.offsetWidth;
        this._bgCanvas.height = this._bgCanvas.offsetHeight;

        this._midCanvas.width = this._midCanvas.offsetWidth;
        this._midCanvas.height = this._midCanvas.offsetHeight;

        this._foreCanvas.width = this._foreCanvas.offsetWidth;
        this._foreCanvas.height = this._foreCanvas.offsetHeight;

        this._width = this._bgCanvas.offsetWidth;
        this._height = this._bgCanvas.offsetHeight;


        if(this._resizeHandler != null){
            this._resizeHandler();
        }
    }

    private _mouseDown(event: MouseEvent){
        if(this._mouseDownHandler != null){
            let mousePos = this._getMouseScreenPosition(event);
            this._mouseDownHandler(mousePos.x, mousePos.y);
        }
    }

    private _mouseUp(event: MouseEvent){
        if(this._mouseUpHandler != null){
            let mousePos = this._getMouseScreenPosition(event);
            this._mouseUpHandler(mousePos.x, mousePos.y);
        }
    }

    private _mouseMove(event: MouseEvent){
        if(this._mouseMoveHandler != null){
            let mousePos = this._getMouseScreenPosition(event);
            this._mouseMoveHandler(mousePos.x, mousePos.y);
        }
    }

    private _getMouseScreenPosition(event: MouseEvent):MousePosition {
        let rect = this._foreCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        return new MousePosition(x,y);
    }

    private _createCanvas(z: number): HTMLCanvasElement{
        let newCanvas = document.createElement('canvas');
        //newCanvas.style.width = "100%";
        //newCanvas.style.height = "100%";
        newCanvas.style.position = "absolute";  // Put these canvases on top of one another
        newCanvas.style.top = "0";
        newCanvas.style.left = "0";
        newCanvas.style.zIndex = z.toString();

        return newCanvas;
    }


    // ----- Public Methods -----
    public init(){
        this._bgCanvas = this._createCanvas(5);
        this._midCanvas = this._createCanvas(6);
        this._foreCanvas = this._createCanvas(7);

        this._then = Date.now();

        if(this._id != null){
            let parent = document.getElementById(this._id);
            if(parent != null && parent != undefined){
                parent.appendChild(this._bgCanvas);
                parent.appendChild(this._midCanvas);
                parent.appendChild(this._foreCanvas);

                this._bgCanvas.width = parent.offsetWidth;
                this._bgCanvas.height = parent.offsetHeight;
    
                this._midCanvas.width = parent.offsetWidth;
                this._midCanvas.height = parent.offsetHeight;
    
                this._foreCanvas.width = parent.offsetWidth;
                this._foreCanvas.height = parent.offsetHeight;

                this._width = parent.offsetWidth;
                this._height = parent.offsetHeight;
            }

            this._foreCanvas.addEventListener("resize", () => {this._resize()});
            this._foreCanvas.addEventListener("mousedown", (event: MouseEvent) => {this._mouseDown(event)});
            this._foreCanvas.addEventListener("mouseup", (event: MouseEvent) => {this._mouseUp(event)});
            this._foreCanvas.addEventListener("mousemove", (event: MouseEvent) => {this._mouseMove(event)});

            if(this._setupHandler != null){
                this._setupHandler(this._width, this._height);
            }

            this._animate();
        }

    }

    // ----- Public Methods -----

    // Event handler registration
    onSetup(s: SetupCallback){
        this._setupHandler = s;
    }

    onUpdate(u: UpdateCallback){
        this._updateHandler = u;
    }

    onDraw(d: DrawCallback){
        this._drawHandler = d;
    }

    onResize(r:ResizeCallback){
        this._resizeHandler = r;
    }

    onMouseDown(d: MouseDownCallback){
        this._mouseDownHandler = d;
    }

    onMouseUp(u: MouseUpCallback){
        this._mouseUpHandler = u;
    }

    onMouseMove(m: MouseMoveCallback){
        this._mouseMoveHandler = m;
    }

    // Starting / Stopping animation
    start(){
        this._active = true;
        this._animate();
    }

    stop(){
        this._active = false;
    }

    animateSingleFrame(){
        this._now = Date.now();
        this._elapsed = this._now - this._then;
        this._elapsed = this._elapsed > this.deltaCap ? this.deltaCap : this._elapsed;
        this._update(this._elapsed);
        this._draw(this._elapsed);

        this._then = this._now;
    }

    // Field Access
    isActive(){
        return this._active;
    }

    getFramerateTarget(){
        return this._framerateTarget;
    }

    setFramerateTarget(newTarget: number){
        // INOP: Awaiting better implementation of custom framerates
        // if(newTarget != this._framerateTarget){
        //     this._framerateTarget = newTarget;
        // }
    }

    // ----- Constructor -----
    constructor(id: string, config?:JumpstartConfiguration){
        if(config != null){
            this._setupHandler = config.setup != null ? config.setup : null;
            this._updateHandler = config.update != null ? config.update : null;
            this._drawHandler = config.draw != null ? config.draw : null;
            this._resizeHandler = config.resize != null ? config.resize : null;
            this._mouseDownHandler = config.mouseDown != null ? config.mouseDown : null;
            this._mouseUpHandler = config.mouseUp != null ? config.mouseUp : null;
            this._mouseMoveHandler = config.mouseMove != null ? config.mouseMove : null;
            this._active = config.active != null ? config.active : true;
            this._framerateTarget = -1 
            this.deltaCap = config.deltaCap != null ? config.deltaCap : 1000;
        } else {
            this._setupHandler = null;
            this._updateHandler = null;
            this._drawHandler = null;
            this._resizeHandler = null;
            this._mouseDownHandler = null;
            this._mouseUpHandler = null;
            this._mouseMoveHandler = null;
            this._active = true;
            this._framerateTarget = -1;
            this.deltaCap = 1000;
        }

        this._width = 0;
        this._height = 0;

        this._id = id;
    }
}