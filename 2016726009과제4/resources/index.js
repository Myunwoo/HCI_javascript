const parser = math.parser();

const SYMBOL_WIDTH = 50;
const SYMBOL_HEIGHT = 50;

let MathApp = {};

MathApp.symbol_paths = {
        '+':    "add",
        '-':    "sub",
        '*':    "mul",
        '/':    "div",
        '(':    "parenthesis_open",
        ')':    "parenthesis_close",
        '[':    "squarebracket_open",
        ']':    "squarebracket_close",
        '{':    "curlybrace_open",
        '}':    "curlybrace_close",
        '.':    "period",
        ',':    "comma",
        ':':    "colon",
        ';':    "semicolon",
        '=':    "equal",
        '>':    "more",
        '<':    "less",
        '!':    "exclamation"
};

MathApp.blocks = [];
MathApp.selected_block = null;

MathApp.is_mouse_dragging = false;
MathApp.mouse_drag_prev = {x:0, y:0};

MathApp.block_types = {
    UNDEFINED:  "undefind",
    SYMBOL:     "symbol",
};

MathApp.initialize = function() {
    //숫자를 symbol_path에 저장
    for(let i=0; i <= 9; i++)
    {
        let key = i.toString();
        let value = key;
        this.symbol_paths[key] = value;
    }
    //알파벳을 symbol_path에 저장
    for(let c="a".charCodeAt(0); c <= "z".charCodeAt(0); c++)
    {
        let key = String.fromCharCode(c);
        let value = key;
        this.symbol_paths[key] = value;
    }

    this.canvas = new fabric.Canvas("a", {
        backgroundColor: "#eee",
        hoverCursor: "default",
        selection: false,
        width: window.innerWidth,
        height: window.innerHeight
    });

    this.canvas.add(new fabric.Line([0,0,0,window.innerHeight],{
      left:window.innerWidth * (4.0/5.0),
      top: 0,
      stroke: 'black'
    }));
    this.canvas.add(new fabric.Line([0,0,window.innerWidth,0],{
      left:0,
      top: window.innerHeight * (1.0/100.0),
      stroke: 'black'
    }));

    //
    $(document).keypress(function(event) {
        let key = String.fromCharCode(event.which);
        MathApp.handleKeyPress(key);
    });
    $(document).keydown(function(event) {
      let key;
      if(event.which == 13){
        key = "enter";
      }
      else{
        key = String.fromCharCode(event.which);
      }
        MathApp.handleKeyDown(key);
    });
    $(document).mousedown(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        MathApp.handleMouseDown(p);
    });
    $(document).mouseup(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        MathApp.handleMouseUp(p);
    });
    $(document).mousemove(function(event) {
        let p = {x: event.pageX, y: event.pageY};
        MathApp.handleMouseMove(p);
    });
}

MathApp.handleKeyPress = function(key) {
    if (key in this.symbol_paths)
    {
        let size = {
            width : SYMBOL_WIDTH,
            height : SYMBOL_HEIGHT
        };
        let position = {
            x : (Math.random() * (this.canvas.width-size.width)
                  + size.width/2) * (4.0/5.0),
            y : (Math.random() * (this.canvas.height-size.height)
                  + size.height/2) -(window.innerHeight * (1.0/100.0))
        };

        let keyWord2;
        let keyWord3;
        let keyWord5;
        let length = MathApp.blocks.length;
        if(length >=1){
          keyWord2 = MathApp.blocks[length-1].name + key;
        }
        if(length >= 2){
          keyWord3 = MathApp.blocks[length-2].name + MathApp.blocks[length-1].name + key;
        }
        if(length >= 4){
          keyWord5 = MathApp.blocks[length-4].name + MathApp.blocks[length-3].name
          + MathApp.blocks[length-2].name + MathApp.blocks[length-1].name + key;
        }
        if(keyWord2 == "pi" || keyWord2 == "==" || keyWord2 == "!=" || keyWord2 == "<="
          || keyWord2 == ">=")
        {
          size = {
            width : SYMBOL_WIDTH * keyWord2.length,
            height : SYMBOL_HEIGHT
          }
          MathApp.selected_block = null;
          MathApp.blocks[length-1].destroy();
          let new_symbol = new MathApp.Symbol(position, size, keyWord2);
        }
        else if(keyWord3 == "exp" || keyWord3 == "log" || keyWord3 == "sin" || keyWord3 == "cos"
          || keyWord3 == "tan" || keyWord3 == "det")
        {
          size = {
            width : SYMBOL_WIDTH * keyWord3.length,
            height : SYMBOL_HEIGHT
          }
          MathApp.selected_block = null;
          MathApp.blocks[length-1].destroy();
          MathApp.blocks[length-2].destroy();
          let new_symbol = new MathApp.Symbol(position, size, keyWord3);
        }
        else if(keyWord5 == "cross"){
          size = {
            width : SYMBOL_WIDTH * keyWord5.length,
            height : SYMBOL_HEIGHT
          }
          MathApp.selected_block = null;
          MathApp.blocks[length-1].destroy();
          MathApp.blocks[length-2].destroy();
          MathApp.blocks[length-3].destroy();
          MathApp.blocks[length-4].destroy();
          let new_symbol = new MathApp.Symbol(position, size, keyWord5);
        }
        else{
          let new_symbol = new MathApp.Symbol(position, size, key);
        }
    }
}

var isCtrl = false;

//화살표 이벤트 처리를 위한 ketDown 이벤트 핸들러
MathApp.handleKeyDown = function(key) {
  if(key == '')
    isCtrl = true;

    if(MathApp.selected_block != null){
      if(key == '.'){
        MathApp.selected_block.destroy();
        MathApp.selected_block=null;
        return;
      }
      else if(key=='Z' && isCtrl == true){
        MathApp.seperate();
        MathApp.selected_block=null;
        return;
      }
      else if(key=='C' && isCtrl == true){
        let block = MathApp.selected_block;
        let size = {
          width: block.size.width,
          height: block.size.height
        }
        let position = {
          x: block.position.x,
          y: block.position.y + SYMBOL_HEIGHT
        }
        let copy = new MathApp.Symbol(position, size, block.name);
      }
      //왼쪽에 있을때
      if(MathApp.selected_block.position.x < window.innerWidth * (4.0/5.0)){
        if(key == "'"){
          MathApp.selected_block.moveTo({x: window.innerWidth * (4.0/5.0) + 30 + MathApp.selected_block.name.length* 25,
                                        y: MathApp.selected_block.position.y});
        MathApp.canvas.requestRenderAll();
        }
      }
      //오른쪽에 있을때
      else{
        if(key == '%'){
          MathApp.selected_block.moveTo({x: MathApp.selected_block.name.length* 25, y: MathApp.selected_block.position.y});
          MathApp.canvas.requestRenderAll();
        }
      }
      if(key == "enter"){
        MathApp.eval_func(MathApp.selected_block);
      }
    }
}

MathApp.handleMouseDown = function(window_p) {
    if(MathApp.isInCanvas(window_p))
    {
        let canvas_p = MathApp.transformToCanvasCoords(window_p);

        if( MathApp.selected_block != null )
        {
            MathApp.selected_block.onDeselected();
            MathApp.selected_block = null;
        }
        let block = MathApp.findBlockOn(canvas_p);
        if(block != null)
        {
            MathApp.selected_block = block;
            MathApp.selected_block.onSelected();
        }
        MathApp.is_mouse_dragging = true;
        MathApp.mouse_drag_prev = canvas_p;
        MathApp.canvas.requestRenderAll();
    }
    else
    {
        MathApp.is_mouse_dragging = false;
        MathApp.mouse_drag_prev = {x:0, y:0};
    }
}

MathApp.handleMouseMove = function(window_p) {
  let canvas_p = MathApp.transformToCanvasCoords(window_p);
  let block = MathApp.findBlockOn(canvas_p);
    if(MathApp.is_mouse_dragging)
    {
        if(MathApp.selected_block != null)
        {
            let tx = canvas_p.x - MathApp.mouse_drag_prev.x;
            let ty = canvas_p.y - MathApp.mouse_drag_prev.y;
            MathApp.selected_block.translate({x: tx, y: ty});
        }
        MathApp.mouse_drag_prev = canvas_p;
        MathApp.canvas.requestRenderAll();
    }
}

MathApp.handleMouseUp = function(window_p) {
    let canvas_p = MathApp.transformToCanvasCoords(window_p);
    let target = MathApp.findBlockOn(canvas_p);

    //마우스업 이벤트가 발생하는 지점에 블록이 있는 경우
    if(target != null){
      //블록과 블록이 겹쳐있는지 확인하는 부분
      //selected_block과 겹친 블록이 존재하면 인덱스리턴
      let block = MathApp.overlap();
      if(block != undefined)
        MathApp.combine(block);
    }
    if(MathApp.is_mouse_dragging)
    {
        MathApp.is_mouse_dragging = false;
        MathApp.mouse_drag_prev = {x:0, y:0};
    }
    //블록을 합치고 나서 새로 그리기
    MathApp.canvas.requestRenderAll();
}

//생성되어 있는 모든 블록과 target의 거리를 계산해 겹쳐질만큼
MathApp.overlap = function(){
  if(MathApp.selected_block != null){
    let selBlock = MathApp.selected_block;
    for(let i=0;i<MathApp.blocks.length;i++){
      let difX = Math.abs(selBlock.position.x - MathApp.blocks[i].position.x);
      let difY = Math.abs(selBlock.position.y - MathApp.blocks[i].position.y);
      let rangeX = (selBlock.size.width / 2) + (MathApp.blocks[i].size.width / 2);
      let rangeY = (selBlock.size.height / 2) + (MathApp.blocks[i].size.height / 2);
      //selected_block과 selected_block의 비교
      if((difX==0) && (difY==0))
        continue;
        //충돌 발생시 해당 블록의 인덱스 리턴
        else if((difX <= rangeX) && (difY <= rangeY))
        return MathApp.blocks[i];
      }
      return undefined;
    }
}

MathApp.combine = function(block){
  let target = block
  let selected_block = MathApp.selected_block;
  let size = {
    width: target.size.width + selected_block.size.width,
    height: target.size.height
  };
  let position = {
    x: target.position.x,
    y: target.position.y
  };
  //새로운 크기와 새로운 이름의 블록을 만들고 기존 두 블럭을 제거
  let new_symbol;
  if(target.position.x <= selected_block.position.x)
    new_symbol = new MathApp.Symbol(position, size, target.name + selected_block.name);
  else
    new_symbol = new MathApp.Symbol(position, size, selected_block.name + target.name);
  target.destroy();
  selected_block.destroy();
  MathApp.selected_block = null;
}

MathApp.seperate = function(){
  if(MathApp.selected_block == null)
    return;
  let selBlock = MathApp.selected_block;
  let size = {
      width: SYMBOL_WIDTH,
      height: SYMBOL_HEIGHT
  };
  for(let i=0;i<selBlock.name.length;i++){
    //블록이 합쳐져 있던 순서대로 놓이도록 하기 위해 (SYMBOL_WIDTH * i)만큼 오른쪽으로 이동하며 배치
    let position = {
        x: selBlock.position.x - selBlock.size.width / 2 + 15 + (SYMBOL_WIDTH * i),
        y: selBlock.position.y
    };
    let new_symbol = new MathApp.Symbol(position, size, selBlock.name[i]);
  }
  selBlock.destroy();
  MathApp.selected_block = null;
}

MathApp.transformToCanvasCoords = function(window_p) {
    let rect = MathApp.canvas.getElement().getBoundingClientRect();
    let canvas_p = {
        x : window_p.x - rect.left,
        y : window_p.y - rect.top
    };
    return canvas_p;
}

MathApp.isInCanvas = function(window_p) {
    let rect = MathApp.canvas.getElement().getBoundingClientRect();
    if( window_p.x >= rect.left &&
        window_p.x < rect.left + rect.width &&
        window_p.y >= rect.top &&
        window_p.y < rect.top + rect.height )
    {
        return true;
    }
    else
    {
        return false;
    }
}

MathApp.findBlockOn = function(canvas_p) {
    let x = canvas_p.x;
    let y = canvas_p.y;

    for(let i=0; i < this.blocks.length; i++)
    {
        let block = this.blocks[i];

        if( x >= block.position.x - block.size.width/2 &&
            x <= block.position.x + block.size.width/2 &&
            y >= block.position.y - block.size.height/2 &&
            y <= block.position.y + block.size.height/2 )
        {
            return block;
        }
    }
    return null;
}

//
MathApp.Block = function(position, size) {
    this.position = position;
    this.size = size;
    this.type = MathApp.block_types.UNDEFINED;

    this.visual_items = [];

    MathApp.blocks.push(this);
}

MathApp.Block.prototype.onDeselected = function() {
    this.visual_items[this.visual_items.length-1].set({
        stroke: "rgba(0,0,255,1)"
    });
}

MathApp.Block.prototype.onSelected = function() {
    this.visual_items[this.visual_items.length-1].set({
        stroke: "rgba(255,0,0,1)"
    });

    this.visual_items.forEach(item => {
        MathApp.canvas.bringToFront(item);
    });
}

MathApp.Block.prototype.moveTo = function(p) {
    let tx = p.x - this.position.x;
    let ty = p.y - this.position.y;

    this.translate({x: tx, y: ty});
}

MathApp.Block.prototype.translate = function(v) {
    this.position.x += v.x;
    this.position.y += v.y;

    this.visual_items.forEach(item => {
        item.left += v.x;
        item.top += v.y;
    });
}

MathApp.Block.prototype.destroy = function() {
    if(this == MathApp.selected_block)
    {
        MathApp.selected_block = null;
        this.onDeselected();
    }

    this.visual_items.forEach(item => {
        MathApp.canvas.remove(item);
    });
    this.visual_items = [];

    let index = MathApp.blocks.indexOf(this);
    if(index > -1)
    {
        MathApp.blocks.splice(index, 1);
    }
}

//name의 길이에 따라 size를 결정해야 한다.
MathApp.Symbol = function(position, size, name) {
  MathApp.Block.call(this, position, size);
  this.type = MathApp.block_types.SYMBOL;
  this.name = name;
  let nameLen = name.length;
  let block = this;

  // (0) Background
  let background = new fabric.Rect({
      left: position.x - size.width/2,
      top: position.y - size.height/2,
      width: size.width,
      height: size.height,
      fill: "rgba(255,255,255,1)",
      stroke: "rgba(0,0,0,0)",
      selectable: false
  });
  MathApp.canvas.add(background);
  block.visual_items.push(background);

  for(let i=0; i<nameLen; i++){
    if(name[i] in MathApp.symbol_paths){
      let path = "resources/" + MathApp.symbol_paths[name[i]] + ".jpg";
      fabric.Image.fromURL(path, function(img) {
        // (1) Image
        //이미지의 크기가 size에 따라 커지면 안되므로 조정
        img.scaleToWidth(SYMBOL_WIDTH);
        img.scaleToHeight(SYMBOL_HEIGHT);
        let img_w = img.getScaledWidth();
        let img_h = img.getScaledHeight();

        img.set({
          //상자의 중심이 position이면, 왼쪽으로 상자의 폭/2 만큼 이동 후 이미지를 배치(6은 임의의숫자)
            left: position.x - size.width/2 + SYMBOL_WIDTH*i + 6,
            top: position.y - img_h/2,
            selectable: false
        });

        // (2) Boundary
        let boundary = new fabric.Rect({
            left: position.x - size.width/2,
            top: position.y - size.height/2,
            width: size.width,
            height: size.height,
            fill: "rgba(0,0,0,0)",
            stroke: "rgba(0,0,255,1)",
            strokeWidth: 5,
            selectable: false
        });

        MathApp.canvas.add(img);
        MathApp.canvas.add(boundary);
        block.visual_items.push(img);
        block.visual_items.push(boundary);
      });
    }
  }
}

MathApp.Symbol.prototype = Object.create(MathApp.Block.prototype);

MathApp.eval_func = function(block){
  try{
    let replacedExpression = block.name.replace("×","*");
    replacedExpression = replacedExpression.replace("÷","/");
    var result = parser.eval(replacedExpression).toString();
    let tokens = result.split(' ');
    if(tokens[0] == 'function'){
      result = tokens[0];
    }
    let position = {x: window.innerWidth * (4.0/5.0) + 30 + (result.length* 25), y: block.position.y};
    let size = {width: SYMBOL_WIDTH*(result.length), height:SYMBOL_HEIGHT};
    new MathApp.Symbol(position, size, result);
  }
  catch{
    if(result != 'function'){
      let position = {x: window.innerWidth * (4.0/5.0) + 30 + ("error".length* 25), y: block.position.y};
      let size = {width: SYMBOL_WIDTH*("error".length), height:SYMBOL_HEIGHT};
      new MathApp.Symbol(position, size, "error");
    }
  }
}

//
$(document).ready(function() {
    MathApp.initialize();
});
