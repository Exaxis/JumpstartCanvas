export type SetupCallback = (width: number, height: number) => void;
export type UpdateCallback = () => void;
export type DrawCallback = (width: number, height: number, foreCanvas: CanvasRenderingContext2D, midCanvas: CanvasRenderingContext2D, bgCanvas: CanvasRenderingContext2D) => void;
export type ResizeCallback = () => void;
export type MouseDownCallback = (e: MousePosition) => void;
export type MouseUpCallback = (e: MousePosition) => void;
export type MouseMoveCallback = (e: MousePosition) => void;

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

    private _id: string;

    //----- Main Method Callbacks -----
    private _setupHandler: SetupCallback | null;
    private _updateHandler: UpdateCallback | null;
    private _drawHandler: DrawCallback | null;
    private _resizeHandler: ResizeCallback | null;
    private _mouseDownHandler: MouseDownCallback | null;
    private _mouseUpHandler: MouseUpCallback | null;
    private _mouseMoveHandler: MouseMoveCallback | null;

    //----- Public Members -----

    //----- Private Methods =====
    
    // Performs one frame of animation, i.e., updating logic and drawing
    private _animate = () => {
        if(this._active){
            this._update();
            this._draw();
        }
    }

    private _update = () => {
        if(this._updateHandler != null){
            this._updateHandler();
        }
    }

    private _draw(){
        if(this._drawHandler != null){
            let foreContext = this._foreCanvas.getContext("2d");
            let midContext = this._midCanvas.getContext("2d");
            let bgContext = this._bgCanvas.getContext("2d");

            if(foreContext != null && midContext != null && bgContext != null){
                this._drawHandler(this._width, this._height, foreContext, midContext, bgContext)
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
            this._mouseDownHandler(mousePos);
        }
    }

    private _mouseUp(event: MouseEvent){
        if(this._mouseUpHandler != null){
            let mousePos = this._getMouseScreenPosition(event);
            this._mouseUpHandler(mousePos);
        }
    }

    private _mouseMove(event: MouseEvent){
        if(this._mouseMoveHandler != null){
            let mousePos = this._getMouseScreenPosition(event);
            this._mouseMoveHandler(mousePos);
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
        newCanvas.style.width = "100%";
        newCanvas.style.height = "100%";
        newCanvas.style.position = "absolute";
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

        if(this._id != null){
            let parent = document.getElementById(this._id);
            if(parent != null && parent != undefined){
                parent.appendChild(this._bgCanvas);
                parent.appendChild(this._midCanvas);
                parent.appendChild(this._foreCanvas);
            }

            this._bgCanvas.width = this._bgCanvas.offsetWidth;
            this._bgCanvas.height = this._bgCanvas.offsetHeight;

            this._midCanvas.width = this._midCanvas.offsetWidth;
            this._midCanvas.height = this._midCanvas.offsetHeight;

            this._foreCanvas.width = this._foreCanvas.offsetWidth;
            this._foreCanvas.height = this._foreCanvas.offsetHeight;
        
            this._width = this._bgCanvas.offsetWidth;
            this._height = this._bgCanvas.offsetHeight;

            window.addEventListener("resize", this._resize, false);

            this._foreCanvas.addEventListener("mousedown", this._mouseDown, false);
            this._foreCanvas.addEventListener("mouseup", this._mouseUp, false);
            this._foreCanvas.addEventListener("mousemove", this._mouseMove, false);

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

    // ----- Constructor -----
    constructor(id: string, setup: SetupCallback | null, update: UpdateCallback | null, draw: DrawCallback | null, resize: ResizeCallback | null, mouseDown: MouseDownCallback | null, mouseUp: MouseUpCallback | null, mouseMove: MouseMoveCallback | null){
        this._setupHandler = setup;
        this._updateHandler = update;
        this._drawHandler = draw;
        this._resizeHandler = resize;
        this._mouseDownHandler = mouseDown;
        this._mouseUpHandler = mouseUp;
        this._mouseMoveHandler = mouseMove;

        this._width = 0;
        this._height = 0;

        this._active = true;

        this._id = id;
    }
}