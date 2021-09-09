let WebUI = {}
WebUI.parser = math.parser();
WebUI.expression = "";

WebUI.WidgetTypes = {
    UNDEFINED:      "undefind",
    TEXT:           "text",
    IMAGE:          "image",
    PUSH_BUTTON:    "push_button",
    TEXT_FIELD:     "text_field",
    INFO_BOX:       "info_box",
    CONTAINER:      "container",
    ABS_CONTAINER: "abs_container",
    ROW:            "row",
    COLUMN:         "column"
};

WebUI.Alignment = {
    CENTER:         "center",
    LEFT:           "left",
    RIGHT:          "right",
    TOP:            "top",
    BOTTOM:         "bottom"
};

WebUI.Information = {
  EXP: " It means e^ \n ex) exp([input]) ",
  SQRT: " It means √x \n ex) sqrt([input]) ",
  TRIANGULAR: " It means sin/cos/tan of input \n ex) sin([input]) ",
  LOG: " It means ln(x) (natural logarithm) \n ex) log([input]) ",
  FUNC_VAR: " It can be function or variable \n ex) f(x)=x+3 --- then f(3)==6 \n ex) x=3 --- then x+3 == 6 \n w,x,y,z,f,g can be used same way. ",
  I: " It means imaginary number \n ex) i^2 = -1 ",
  E: " It means natural logarithm's base \n ex) ln(e) == 1 ",
  PI: " It means π \n ex) π == 3.1415926...",
  XX: " It is shortcut function. \n when you press x^2, it calculate textbox's expression and show it's squared. ",
  SQRTX: " It is shortcut function. \n when you press sqrt x, it calculate textbox's expression and show it's square root",
  CE: " It clears a word ",
  C: " It clears all words ",
  AC: " It clears all words and all histories "
};

WebUI.widgets = [];
WebUI.focused_widget = null;
WebUI.dragged_widget = null;
WebUI.hovered_widget = null;

WebUI.is_mouse_dragging = false;
WebUI.mouse_drag_start = {x:0, y:0};
WebUI.mouse_drag_prev = {x:0, y:0};

WebUI.app = null;
WebUI.mainView = null;
WebUI.modeView = null;
WebUI.historyView = new Array(5);
WebUI.btnScreenShot = null;
WebUI.tmrCount = 0;
WebUI.intervalReturn = null;
WebUI.abs_container = null;
//≡≡≡≡≡≡≡

WebUI.initialize = function() {
    this.canvas = new fabric.Canvas("normal", {
        backgroundColor: "#eee",
        hoverCursor: "default",
        selection: false,
        width: window.innerWidth,
        height: window.innerHeight
    });

    //
    $(document).keypress(function(event) {
        WebUI.handleKeyPress(event);
    });
    $(document).mousedown(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseDown(p);
    });
    $(document).mouseup(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseUp(p);
    });
    $(document).mousemove(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        WebUI.handleMouseMove(p);
    });

    //
    WebUI.initWidgets();
    WebUI.initVisualItems();
    WebUI.layoutWhenResourceReady();
}
WebUI.initWidgets = function() {
    WebUI.app = new WebUI.Row({
      children: [
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width: 700, height:80},
              horizontal_alignment: WebUI.Alignment.CENTER,
              vertical_alignment: WebUI.Alignment.CENTER,
              children:[ new WebUI.Text("WebUI Calculator", {width:700, height:80})]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:700, height:70},
              horizontal_alignment: WebUI.Alignment.RIGHT,
              vertical_alignment: WebUI.Alignment.CENTER,
              children: [ WebUI.historyView[0] = new WebUI.TextField("",{width:700,height:70}) ]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:700, height:70},
              horizontal_alignment: WebUI.Alignment.RIGHT,
              vertical_alignment: WebUI.Alignment.CENTER,
              children: [ WebUI.historyView[1] = new WebUI.TextField("",{width:700,height:70}) ]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:700, height:70},
              horizontal_alignment: WebUI.Alignment.RIGHT,
              vertical_alignment: WebUI.Alignment.CENTER,
              children: [ WebUI.historyView[2] = new WebUI.TextField("",{width:700,height:70}) ]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:700, height:70},
              horizontal_alignment: WebUI.Alignment.RIGHT,
              vertical_alignment: WebUI.Alignment.CENTER,
              children: [ WebUI.historyView[3] = new WebUI.TextField("",{width:700,height:70}) ]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:700, height:70},
              horizontal_alignment: WebUI.Alignment.RIGHT,
              vertical_alignment: WebUI.Alignment.CENTER,
              children: [ WebUI.historyView[4] = new WebUI.TextField("",{width:700,height:70}) ]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:640, height:80},
              horizontal_alignment: WebUI.Alignment.LEFT,
              vertical_alignment: WebUI.Alignment.CENTER,
              children: [ WebUI.mainView = new WebUI.Text("") ]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("exp","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("log","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("w","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("(","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton(")","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("%","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("CE","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("C","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("AC","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:70, height:60},
              horizontal_alignment: WebUI.Alignment.RIGHT,
              vertical_alignment: WebUI.Alignment.CENTER,
              children: [ WebUI.btnScreenShot = new WebUI.MyPushButton("screen\n shot","#eee", {width:70, height:60}) ]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("sqrt","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("sin","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("x","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("[","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("]","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("^","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("x^2","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("sqrt x","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("÷","#eee", {width:60, height:60})]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("cos","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("tan","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("y","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton(":","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton(";","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("7","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("8","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("9","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("×","#eee", {width:60, height:60})]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("cross","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("det","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("z","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("==","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("!=","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("4","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("5","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("6","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("-","#eee", {width:60, height:60})]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("i","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("e","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("f","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("<=","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton(">=","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("1","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("2","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("3","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("+","#eee", {width:60, height:60})]
            })
          ]
        }),
        new WebUI.Column({
          children:[
            new WebUI.Container({
              desired_size: {width:30, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("pi","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("=","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("g","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("<","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton(">","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:5, height:30}
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton(",","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("0","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton(".","#eee", {width:60, height:60})]
            }),
            new WebUI.Container({
              desired_size: {width:60, height:60},
              horizontal_alignment:WebUI.Alignment.CENTER,
              vertical_alignment:WebUI.Alignment.CENTER,
              children:[new WebUI.MyPushButton("EV","#eee", {width:60, height:60})]
            })
          ]
        })
      ]
    });
    WebUI.historyView[0].padding = 0;
    WebUI.historyView[1].padding = 0;
    WebUI.historyView[2].padding = 0;
    WebUI.historyView[3].padding = 0;
}


//
WebUI.initVisualItems = function() {
    WebUI.widgets.forEach(widget => {
        widget.initVisualItems();
    });
    WebUI.clear_func();
}

WebUI.layoutWhenResourceReady = function() {
    let is_resource_loaded = true;
    for (let i in WebUI.widgets) {
        let widget = WebUI.widgets[i];
        if (!widget.is_resource_ready) {
            is_resource_loaded = false;
            break;
        }
    }

    if (!is_resource_loaded) {
        setTimeout(arguments.callee, 50);
    }
    else {
        WebUI.app.layout();
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handle = function(event) {
    let is_handled = false;

    if (WebUI.focused_widget) {
        is_handled = WebUI.focused_widget.handle(event) || is_handled;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseDown = function(window_p) {
    let is_handled = false;

    if (WebUI.isInCanvas(window_p)) {
        let canvas_p = WebUI.transformToCanvasCoords(window_p);

        WebUI.is_mouse_dragging = true;
        WebUI.mouse_drag_start = canvas_p;
        WebUI.mouse_drag_prev = canvas_p;

        let widget = WebUI.findWidgetOn(canvas_p);
        if (widget) {
            WebUI.focused_widget = widget;

            if (widget.is_draggable) {
                WebUI.dragged_widget = widget;
            }
            else {
                WebUI.dragged_widget = null;
            }

            is_handled = widget.handleMouseDown(canvas_p) || is_handled;
        }
        else {
            WebUI.focused_widget = null;
            WebUI.dragged_widget = null;
        }
    }
    else {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.focused_widget = null;
        WebUI.dragged_widget = null;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseMove = function(window_p) {
    let canvas_p = WebUI.transformToCanvasCoords(window_p);
    let is_handled = false;

    let widget = WebUI.findWidgetOn(canvas_p);
    if (widget != WebUI.hovered_widget) {
        if (WebUI.hovered_widget != null) {
            is_handled = WebUI.hovered_widget.handleMouseExit(canvas_p) || is_handled;
        }
        if (widget != null) {
            is_handled = widget.handleMouseEnter(canvas_p) || is_handled;
        }
        WebUI.hovered_widget = widget;
    }
    else {
        if (widget) {
            is_handled = widget.handleMouseMove(canvas_p) || is_handled;
        }
    }

    if (WebUI.is_mouse_dragging) {
        if (WebUI.dragged_widget != null) {
            let tx = canvas_p.x - WebUI.mouse_drag_prev.x;
            let ty = canvas_p.y - WebUI.mouse_drag_prev.y;
            WebUI.dragged_widget.translate({x: tx, y: ty});

            is_handled = true;
        }
        WebUI.mouse_drag_prev = canvas_p;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.handleMouseUp = function(window_p) {
    let is_handled = false;
    let canvas_p = WebUI.transformToCanvasCoords(window_p);

    let widget  = WebUI.findWidgetOn(canvas_p);
    if (widget) {
        is_handled = widget.handleMouseUp(canvas_p) || is_handled;
    }

    if (WebUI.is_mouse_dragging) {
        WebUI.is_mouse_dragging = false;
        WebUI.mouse_drag_start = {x:0, y:0};
        WebUI.mouse_drag_prev = {x:0, y:0};

        WebUI.dragged_widget = null;

        is_handled = true;
    }

    if (is_handled) {
        WebUI.canvas.requestRenderAll();
    }
}

WebUI.transformToCanvasCoords = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    let canvas_p = {
        x : window_p.x - rect.left,
        y : window_p.y - rect.top
    };
    return canvas_p;
}

WebUI.isInCanvas = function(window_p) {
    let rect = WebUI.canvas.getElement().getBoundingClientRect();
    if (window_p.x >= rect.left &&
        window_p.x < rect.left + rect.width &&
        window_p.y >= rect.top &&
        window_p.y < rect.top + rect.height) {
        return true;
    }
    else {
        return false;
    }
}

WebUI.findWidgetOn = function(canvas_p) {
    let x = canvas_p.x;
    let y = canvas_p.y;

    for (let i=0; i < this.widgets.length; i++) {
        let widget = this.widgets[i];

        if (x >= widget.position.left &&
            x <= widget.position.left + widget.size.width &&
            y >= widget.position.top &&
            y <= widget.position.top + widget.size.height) {
            return widget;
        }
    }
    return null;
}

WebUI.maxSize = function(size1, size2) {
    let max_size = {width: 0, height: 0};

    max_size.width = (size1.width > size2.width) ? size1.width : size2.width;
    max_size.height = (size1.height > size2.height) ? size1.height : size2.height;
    return max_size;
}

WebUI.minSize = function(size1, size2) {
    let min_size = {width:0, height:0};

    min_size.width = (size1.width < size2.width) ? size1.width : size2.width;
    min_size.height = (size1.height < size2.height) ? size1.height : size2.height;

    return min_size;
}


//
WebUI.Widget = function(properties) {
    this.type = WebUI.WidgetTypes.UNDEFINED;

    this.is_draggable = false;
    this.is_movable = true;

    //
    this.parent = null;
    this.children = [];

    //
    this.position = {left: 0, top: 0};
    this.size = {width: 0, height: 0};

    //
    this.visual_items = [];
    this.is_resource_ready = false;

    //
    WebUI.widgets.push(this);

    if(properties != undefined){
      for(let name in properties){
        let value = properties[name];
        if(name == 'children'){
          value.forEach(child=>{
            child.parent = this;
            this.children.push(child);
          })
        }
        else{
          this[name] = value;
        }
      }
    }


    //
    this.setDefaultProperty('desired_size', {width: 0, height: 0});
    this.setDefaultProperty('horizontal_alignment', WebUI.Alignment.CENTER);
    this.setDefaultProperty('vertical_alignment', WebUI.Alignment.TOP);
    this.setDefaultProperty('fill_color', 'white');
    this.setDefaultProperty('stroke_color', 'black');
    this.setDefaultProperty('stroke_width', 1);
    this.setDefaultProperty('text_align', 'left');
    this.setDefaultProperty('text_color', 'black');
    this.setDefaultProperty('font_family', 'System');
    this.setDefaultProperty('font_size', 20);
    this.setDefaultProperty('font_weight', 'bold');
    this.setDefaultProperty('padding', 5);
    this.setDefaultProperty('margin', 10);
}

WebUI.Widget.prototype.setDefaultProperty = function(name, value) {
    if (this[name] == undefined) {
        this[name] = value;
    }
}

WebUI.Widget.prototype.getBoundingRect = function() {
    return {
        left:   this.position.left,
        top:    this.position.top,
        width:  this.size.width,
        height: this.size.height
    };
}

WebUI.Widget.prototype.layout = function() {
    this.measure();
    this.arrange(this.position);
}

WebUI.Widget.prototype.measure = function() {
    if(this.children.length > 0){
      this.size_children = {width: 0, height: 0};
      this.children.forEach(child => {
        let size_child = child.measure();
        this.size_children = this.extendSizeChildren(this.size_children, size_child);
      });
      this.size = WebUI.maxSize(this.desired_size, this.size_children);
    }
    else{
      this.size.width += this.padding * 2;
      this.size.height += this.padding * 2;
    }
    return this.size;
}

WebUI.Widget.prototype.arrange = function(position) {
    //arrange this
    this.moveTo(position);
    this.visual_items.forEach(item => {WebUI.canvas.add(item);});

    //arrange children
    if(this.children.length > 0){
      let left_spacing = 0, top_spacing = 0;

      if(this.size.width > this.size_children.width){
        let room_width = this.size.width - this.size_children.width;

        if(this.horizontal_alignment == WebUI.Alignment.LEFT)
          left_spacing = this.padding;
        else if(this.horizontal_alignment == WebUI.Alignment.CENTER)
          left_spacing = this.padding + room_width / 2.0;
        else if(this.horizontal_alignment == WebUI.Alignment.RIGHT)
          left_spacing = this.padding + room_width;
      }

      if(this.size.height > this.size_children.height){
        let room_height = this.size.height - this.size_children.height;

        if(this.vertical_alignment == WebUI.Alignment.TOP)
          top_spacing = this.padding;
        else if(this.vertical_alignment == WebUI.Alignment.CENTER)
          top_spacing = this.padding + room_height/ 2.0;
        else if (this.vertical_alignment == WebUI.Alignment.BOTTOM)
          top_spcing = this.padding + room_height;
      }

      let next_position = {left: position.left + left_spacing, top: position.top + top_spacing};
      this.children.forEach(child => {
        child.arrange(next_position);
        next_position = this.calcNextPosition(next_position, child.size);
      });
    }
}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.extendSizeChildren = function(size, child_size) {
    if (size.width < child_size.width)      size.width = child_size.width;
    if (size.height < child_size.height)    size.height = child_size.height;

    return size;
}

// default implementation that is expected to be overridden
WebUI.Widget.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;

    return {left: next_left, top: next_top};
}


WebUI.Widget.prototype.initVisualItems = function() {
    this.is_resource_ready = true;
    return true;
}

WebUI.Widget.prototype.moveTo = function(p) {
    if(!this.is_movable)
    {
        return;
    }

    let tx = p.left - this.position.left;
    let ty = p.top - this.position.top;

    this.translate({x: tx, y: ty});
}

WebUI.Widget.prototype.translate = function(v) {
    if(!this.is_movable)
    {
        return;
    }

    this.position.left += v.x;
    this.position.top += v.y;

    this.visual_items.forEach(item => {
        item.left += v.x;
        item.top += v.y;
    });

    this.children.forEach(child_widget => {
        child_widget.translate(v);
    });
}

WebUI.Widget.prototype.destroy = function() {
    if (this == WebUI.focused_widget) WebUI.focused_widget = null;
    if (this == WebUI.dragged_widget) WebUI.dragged_widget = null;
    if (this == WebUI.hovered_widget) WebUI.hovered_widget = null;

    this.visual_items.forEach(item => {
        WebUI.canvas.remove(item);
    });
    this.visual_items = [];

    let index = WebUI.widgets.indexOf(this);
    if(index > -1)
    {
        WebUI.widgets.splice(index, 1);
    }

    this.children.forEach(child_widget => {
        child_widget.destroy();
    });
    this.children = [];

    // assume that the parent is already null
    // (that is, this widget has been detached from its original parent before being destructed)
}

WebUI.Widget.prototype.handle = function(event) {
    return false;
}

WebUI.Widget.prototype.handleMouseDown = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseMove = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseUp = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseEnter = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleMouseExit = function(canvas_p) {
    return false;
}

WebUI.Widget.prototype.handleResize = function() {
    return false;
}


//
WebUI.Container = function(properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.CONTAINER;
}

WebUI.Container.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Container.prototype.constructor = WebUI.Container;

WebUI.Container.prototype.extendSizeChildren = function(size, child_size) {
    if(size.width < child_size.width) size.width = child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}

WebUI.Container.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left;
    let next_top = position.top;
    return {left: next_left, top: next_top};
}

WebUI.Abs_Container = function(properties){
  WebUI.Widget.call(this, properties);
  this.type = WebUI.WidgetTypes.ABS_CONTAINER;
}

WebUI.Abs_Container.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Abs_Container.prototype.constructor = WebUI.Abs_Container;

WebUI.Abs_Container.prototype.extendSizeChildren = function(size, child_size) {

    if(size.width < child_size.width) size.width = child_size.width;
    size.height += child_size.height;
    return size;
}

WebUI.Abs_Container.prototype.calcNextPosition = function(position, size) {

    let next_left = position.left;
    let next_top = position.top + size.height;
    return {left: next_left, top: next_top};
}
//
WebUI.Column = function(properties) {
    WebUI.Widget.call(this, properties);
    this.type = WebUI.WidgetTypes.COLUMN;
}

WebUI.Column.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Column.prototype.constructor = WebUI.Column;

WebUI.Column.prototype.extendSizeChildren = function(size, child_size) {
    size.width += child_size.width;
    if(size.height < child_size.height) size.height = child_size.height;
    return size;
}

WebUI.Column.prototype.calcNextPosition = function(position, size) {
    let next_left = position.left + size.width;
    let next_top = position.top;
    return {left: next_left, top: next_top};
}


//
WebUI.Row = function(properties) {
    WebUI.Widget.call(this, properties);
    this.type = WebUI.WidgetTypes.ROW;
}

WebUI.Row.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Row.prototype.constructor = WebUI.Row;

WebUI.Row.prototype.extendSizeChildren = function(size, child_size) {

    if(size.width < child_size.width) size.width = child_size.width;
    size.height += child_size.height;
    return size;
}

WebUI.Row.prototype.calcNextPosition = function(position, size) {

    let next_left = position.left;
    let next_top = position.top + size.height;
    return {left: next_left, top: next_top};
}


//
WebUI.Text = function(label, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.TEXT;
    this.label = label;
}

WebUI.Text.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Text.prototype.constructor = WebUI.Text;

WebUI.Text.prototype.initVisualItems = function() {
    let text = new fabric.Text(this.label, {
        left:       this.position.left,
        top:        this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    //
    let bound = text.getBoundingRect();
    this.position.left = bound.left;
    this.position.top = bound.top;
    this.size.width = bound.width;
    this.size.height = bound.height;

    //
    this.visual_items.push(text);
    this.is_resource_ready = true;
}

WebUI.Text.prototype.setLabel = function(new_label) {
    let text = this.visual_items[0];

    text.set('text', new_label);

    this.label = new_label;

    WebUI.canvas.requestRenderAll();
}

WebUI.Info_Box = function(label,properties){
  WebUI.Widget.call(this);
  this.type = WebUI.WidgetTypes.INFO_BOX;
  this.label = label;
}

WebUI.Info_Box.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Info_Box.prototype.constructor = WebUI.Info_Box;

WebUI.Info_Box.prototype.initVisualItems = function(properties) {
  let text = new fabric.Text(this.label, {
      left:       this.position.left,
      top:        this.position.top,
      selectable: false,
      fontFamily: this.font_family,
      fontSize:   this.font_size,
      fontWeight: this.font_weight,
      textAlign:  this.text_align,
      stroke:     this.text_color,
      fill:       this.text_color,
  });

  //
  let bound = text.getBoundingRect();
  this.position.left = bound.left;
  this.position.top = bound.top;
  this.size.width = bound.width;
  this.size.height = bound.height;


  let line1 = new fabric.Line([this.position.left,this.position.top,this.position.left+this.size.width,this.position.top],{
    strokeDashArray: [5,5],
    stroke: 'black'
  });
  let line2 = new fabric.Line([this.position.left+this.size.width,this.position.top,this.position.left+this.size.width,this.position.top+this.size.height],{
    strokeDashArray: [5,5],
    stroke: 'black'
  });
  let line3 = new fabric.Line([this.position.left+this.size.width,this.position.top+this.size.height,this.position.left,this.position.top+this.size.height],{
    strokeDashArray: [5,5],
    stroke: 'black'
  });
  let line4 = new fabric.Line([this.position.left,this.position.top+this.size.height,this.position.left,this.position.top],{
    strokeDashArray: [5,5],
    stroke: 'black'
  });

  let boundary = new fabric.Rect({
      left: this.position.left,
      top: this.position.top,
      width: this.size.width,
      height: this.size.height,
      fill: 'white',
      stroke: 'white',
      strokeWidth: this.stroke_width,
      selectable: false
  });

  this.visual_items.push(boundary);
  this.visual_items.push(text);
  this.visual_items.push(line1);
  this.visual_items.push(line2);
  this.visual_items.push(line3);
  this.visual_items.push(line4);

  this.is_resource_ready = true;
}

WebUI.Info_Box.prototype.setLabel = function(new_label) {
    let text = this.visual_items[1];

    text.set('text', new_label);

    this.label = new_label;

    WebUI.canvas.requestRenderAll();
}

//
WebUI.Image = function(path, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.IMAGE;
    this.path = path;
    this.desired_size = desired_size;

}

WebUI.Image.prototype = Object.create(WebUI.Widget.prototype);
WebUI.Image.prototype.constructor = WebUI.Image;

WebUI.Image.prototype.initVisualItems = function() {
    let widget = this;

    fabric.Image.fromURL(this.path, function(img) {

        if (widget.desired_size != undefined) {
            img.scaleToWidth(widget.desired_size.width);
            img.scaleToHeight(widget.desired_size.height);
            widget.size = widget.desired_size;
        }
        else {
            widget.size = {width: img.width, height: img.height};
        }

        img.set({
            left: widget.position.left,
            top: widget.position.top,
            selectable: false,
        });

        widget.visual_items.push(img);
        widget.is_resource_ready = true;
    });
}

//
WebUI.TextField = function(label, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.TEXT_FIELD;
    this.label = label;
    this.desired_size = desired_size;
}

WebUI.TextField.prototype = Object.create(WebUI.Widget.prototype);
WebUI.TextField.prototype.constructor = WebUI.TextField;

WebUI.TextField.prototype.initVisualItems = function() {
    let boundary = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: this.stroke_width,
        selectable: false
    });

    let textbox = new fabric.Textbox(this.label, {
            left:       this.position.left + this.margin,
            selectable: false,
            fontFamily: this.font_family,
            fontSize:   this.font_size,
            fontWeight: this.font_weight,
            textAlign:  this.text_align,
            stroke:     this.text_color,
            fill:       this.text_color,
            editable:   false
        }
    );

    let bound = textbox.getBoundingRect();
    textbox.top = this.position.top + this.desired_size.height/2 - bound.height/2;

    this.size = this.desired_size;

    //
    this.visual_items.push(boundary);
    this.visual_items.push(textbox);
    this.is_resource_ready = true;
}

WebUI.TextField.prototype.handleMouseDown = function(canvas_p) {
    let textbox = this.visual_items[1];
    textbox.enterEditing();

    return true;
}

WebUI.TextField.prototype.handle = function(event) {
    let boundary = this.visual_items[0];
    let textbox = this.visual_items[1];

    let new_label = textbox.text;
    let old_label = this.label;
    this.label = new_label;

    if (event.keyCode == 13) {
        let text_enter_removed = new_label.replace(/(\r\n|\n|\r)/gm, "");
        textbox.text = text_enter_removed;
        this.label = text_enter_removed;

        if (textbox.hiddenTextarea != null) {
            textbox.hiddenTextarea.value = text_enter_removed;
        }

        textbox.exitEditing();

        return true;
    }

    if (old_label != new_label && old_label.length < new_label.length) {
        let canvas = document.getElementById("c");
        let context = canvas.getContext("2d");
        context.font = this.font_size.toString() + "px " + this.font_family;

        let boundary_right = boundary.left + boundary.width - this.margin;
        let text_bound = textbox.getBoundingRect();
        let text_width = context.measureText(new_label).width;
        let text_right = text_bound.left + text_width;

        if (boundary_right < text_right) {
            textbox.text = old_label;
            this.label = old_label;

            if (textbox.hiddenTextarea != null) {
                textbox.hiddenTextarea.value = old_label;
            }

            return true;
        }
    }

    return false;
}

//
WebUI.PushButton = function(label, fill_color, desired_size, properties) {
    WebUI.Widget.call(this, properties);

    this.type = WebUI.WidgetTypes.PUSH_BUTTON;
    this.label = label;
    this.fill_color = fill_color;
    this.desired_size = desired_size;

    this.is_pushed = false;
}

WebUI.PushButton.prototype = Object.create(WebUI.Widget.prototype);
WebUI.PushButton.prototype.constructor = WebUI.PushButton;

WebUI.PushButton.prototype.initVisualItems = function() {
    let background = new fabric.Rect({
        left: this.position.left,
        top: this.position.top,
        width: this.desired_size.width,
        height: this.desired_size.height,
        fill: this.fill_color,
        stroke: this.stroke_color,
        strokeWidth: this.stroke_width,
        selectable: false
    });

    let text = new fabric.Text(this.label, {
        left: this.position.left,
        top: this.position.top,
        selectable: false,
        fontFamily: this.font_family,
        fontSize:   this.font_size,
        fontWeight: this.font_weight,
        textAlign:  this.text_align,
        stroke:     this.text_color,
        fill:       this.text_color,
    });

    let bound = text.getBoundingRect();
    text.left = this.position.left + this.desired_size.width/2 - bound.width/2;
    text.top = this.position.top + this.desired_size.height/2 - bound.height/2;

    this.size = this.desired_size;

    //
    this.visual_items.push(background);
    this.visual_items.push(text);
    this.is_resource_ready = true;
}

WebUI.PushButton.prototype.handleMouseDown = function() {
    if (!this.is_pushed) {
        this.translate({x:0, y:5});
        this.is_pushed = true;

        if (this.onPushed != undefined) {
            this.onPushed.call(this);
        }

        return true;
    }
    else {
        return false;
    }
}

WebUI.PushButton.prototype.handleMouseUp = function() {
    if (this.is_pushed) {
        this.translate({x:0, y:-5});
        this.is_pushed = false;
        return true;
    }
    else {
        return true;
    }
}

WebUI.PushButton.prototype.handleMouseEnter = function() {
    this.visual_items[0].set('strokeWidth', 3);
    return true;
}

WebUI.PushButton.prototype.handleMouseExit = function() {
    this.visual_items[0].set('strokeWidth', 1);

    if (this.is_pushed) {
        this.translate({x:0, y:-5});
        this.is_pushed = false;
    }

    return true;
}

//////////////MyPushButton
WebUI.MyPushButton = function(label, fill_color,desired_size, properties) {
    WebUI.PushButton.call(this, label, fill_color,desired_size, properties);
    this.onPushed = WebUI.MyPushButton.handleButtonPushed;
    this.mouseOn = false;
}

WebUI.MyPushButton.prototype = Object.create(WebUI.PushButton.prototype);
WebUI.MyPushButton.prototype.constructor = WebUI.MyPushButton;

WebUI.MyPushButton.prototype.handleMouseDown = function() {
  if (!this.is_pushed) {
    this.visual_items[0].set('fill', "#ccc");
    this.is_pushed = true;

     if (this.onPushed != undefined) {
         this.onPushed.call(this);
     }
     return true;
   }
 else {
     return false;
 }
}

WebUI.MyPushButton.prototype.handleMouseUp = function() {
    if (this.is_pushed) {
      if(this.mouseOn == true){
        this.visual_items[0].set('fill', "#ddd");
      }
      else{
        this.visual_items[0].set('fill', "#eee");
      }
        this.is_pushed = false;
        return true;
    }
    else {
        return true;
    }
}

WebUI.MyPushButton.prototype.handleMouseEnter = function() {
  let label = "";
  if(this.label == "exp"){
    label = WebUI.Information.EXP;
  }
  else if(this.label == "log"){
    label = WebUI.Information.LOG;
  }
  else if(this.label == "sin" || this.label == "cos" || this.label == "tan"){
    label = WebUI.Information.TRIANGULAR;
  }
  else if(this.label == "w" || this.label == "x" || this.label == "y" || this.label == "z" || this.label == "f" || this.label == "g"){
    label = WebUI.Information.FUNC_VAR;
  }
  else if(this.label == "i"){
    label = WebUI.Information.I;
  }
  else if(this.label == "e"){
    label = WebUi.Information.E;
  }
  else if(this.label == "pi"){
    label = WebUI.Information.PI;
  }
  else if(this.label == "x^2"){
    label = WebUI.Information.XX;
  }
  else if(this.label == "sqrt x"){
    label = WebUI.Information.SQRTX;
  }
  else{
    label = "";
  }

  this.mouseOn = true;
  this.visual_items[0].set('fill', "#ddd");
  startTimer(this,label);
  return true;
}

var startTimer = function(widget,label){
    WebUI.intervalReturn = setInterval(function(){
    WebUI.tmrCount++;
    if(WebUI.tmrCount == 3 && label != ""){
      WebUI.abs_container = new WebUI.Abs_Container({
        position: {left:widget.position.left+100, top:widget.position.top},
        desired_size: {width:60, height:60},
        horizontal_alignment: WebUI.Alignment.CENTER,
        vertical_alignment: WebUI.Alignment.CENTER,
        children: [ new WebUI.Info_Box(label,{width:60, height:60}) ]
      });

      WebUI.abs_container.children.forEach(widget => {
          widget.initVisualItems();
      });
      WebUI.abs_container.layout();
      WebUI.canvas.requestRenderAll();
    }
  }, 500);
}

WebUI.MyPushButton.prototype.handleMouseExit = function() {
  clearInterval(WebUI.intervalReturn);

if(WebUI.abs_container != null){
  WebUI.abs_container.visual_items.forEach(item => {
      WebUI.canvas.remove(item);
  });
  WebUI.abs_container.visual_items = [];

  let index = WebUI.widgets.indexOf(WebUI.abs_container);
  if(index > -1)
  {
      WebUI.widgets.splice(index, 1);
  }

  WebUI.abs_container.children.forEach(child_widget => {
      child_widget.destroy();
  });
  WebUI.abs_container.children = [];
}

  WebUI.tmrCount = 0;
  this.mouseOn = false;
  this.visual_items[0].set('fill', "#eee");
  if (this.is_pushed) {
      this.visual_items[0].set('fill', "#eee");
      this.is_pushed = false;
  }
  return true;
}

WebUI.MyPushButton.handleButtonPushed = function(){
  if(WebUI.expression[0] == "0"){
    WebUI.expression="";
  }
  if(this.label == "C"){
    WebUI.clear_func();
  }
  else if(this.label == "CE"){
    WebUI.expression = WebUI.expression.slice(0,-1);
    if(WebUI.expression == ""){
      WebUI.mainView.setLabel("0");
    }
    else{
      WebUI.mainView.setLabel(WebUI.expression);
    }
  }
  else if(this.label == "AC"){
    for(let i=0; i<5; i++){
      WebUI.historyView[i].visual_items[1].text = "";
    }
    WebUI.clear_func();
  }
  else if(this.label == "EV"){
    let express = WebUI.expression;
    let result = WebUI.eval_func();
    WebUI.addHistory(express, result);
  }
  else if(this.label == "screen\n shot"){
    html2canvas(document.querySelector("#capture")).then(canvas=>{
      saveAs(canvas.toDataURL('image/png'),"calculator image.png");
    });
  }
  else if(this.label == "x^2"){
    try{
      let replacedExpression = WebUI.expression.replace("×","*");
      replacedExpression = replacedExpression.replace("÷","/");
      var result = WebUI.parser.eval(replacedExpression).toString();
      result *= result;
      result = result.toString();
      let tokens = result.split(' ');

      if(tokens[0] == 'function'){
        result = tokens[0];
      }

      WebUI.mainView.setLabel(result);
      WebUI.expression = result;
      return result;
    }
    catch{
      if(result != 'function'){
        WebUI.mainView.setLabel("error");
      }
    }
  }
  else if(this.label == "sqrt x"){
    try{
      let replacedExpression = WebUI.expression.replace("×","*");
      replacedExpression = replacedExpression.replace("÷","/");
      var result = WebUI.parser.eval(replacedExpression).toString();
      result = Math.sqrt(result);
      result = result.toString();
      let tokens = result.split(' ');

      if(tokens[0] == 'function'){
        result = tokens[0];
      }

      WebUI.mainView.setLabel(result);
      WebUI.expression = result;
      return result;
    }
    catch{
      if(result != 'function'){
        WebUI.mainView.setLabel("error");
      }
    }
  }
  else{
    if(WebUI.expression.length < 64)
    WebUI.mainView.setLabel(WebUI.expression+=this.label);
  }
}

var saveAs = function(uri, filename){
  var link = document.createElement('a');
  if(typeof link.download == 'string'){
    link.href = uri;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  else{
    window.open(uri);
  }
}

WebUI.addHistory = function(express, result){
  let history = express + "=" + result;
  let index;
  for(let i=4; i>=0; i--){
    if(WebUI.historyView[i].visual_items[1].text == ""){
      index = i;
      break;
    }
    index = -1;
  }
  if(index != -1){
    WebUI.historyView[index].visual_items[1].text = history;
  }
  else{
    for(let i=0;i<4;i++){
      WebUI.historyView[i].visual_items[1].text =
        WebUI.historyView[i+1].visual_items[1].text;
    }
    WebUI.historyView[4].visual_items[1].text = history;
  }
}

WebUI.clear_func = function(){
  WebUI.expression = "0";
  WebUI.mainView.setLabel(WebUI.expression);
}

WebUI.eval_func = function(){
  try{
    let replacedExpression = WebUI.expression.replace("×","*");
    replacedExpression = replacedExpression.replace("÷","/");
    var result = WebUI.parser.eval(replacedExpression).toString();
    let tokens = result.split(' ');
    if(tokens[0] == 'function'){
      result = tokens[0];
    }
    WebUI.mainView.setLabel(result);
    WebUI.expression = result;
    return result;
  }
  catch{
    if(result != 'function'){
      WebUI.mainView.setLabel("error");
    }
  }
}

//
$(document).ready(function() {
    WebUI.initialize();
});
