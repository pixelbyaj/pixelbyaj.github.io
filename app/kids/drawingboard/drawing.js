const drawing = (function () {
    let stage, layer;
    let currentShape;
    let shapes = [];
    let isDrawing = false;
    let isTransforming = false;
    let selectedShape = 'line';
    let transformer = null;
    let selectedColor = "#4285f4";
    let isFillSelect = false;
    let strokeWidth = 5;
    const Shape = {
        rectangle: (data) => {
            return new Konva.Rect({
                stroke: selectedColor,
                strokeWidth: strokeWidth,
                globalCompositeOperation: 'source-over',
                x: data.x,
                y: data.y,
                width: data.width,
                height: data.height
            });
        },
        circle: (data) => {
            return new Konva.Circle({
                stroke: selectedColor,
                strokeWidth: strokeWidth,
                globalCompositeOperation: 'source-over',
                x: data.x,
                y: data.y,
                radius: data.radius
            });
        },
        line: (data) => {
            return new Konva.Line({
                stroke: selectedColor,
                strokeWidth: strokeWidth,
                globalCompositeOperation: 'source-over',
                points: data.points
            })
        }
    };

    const createStage = (id) => {
        stage = new Konva.Stage({
            container: id,
            width: window.innerWidth,
            height: window.innerHeight - 50 // Adjust for button height
        });
        stageEvents();
    }

    const stageEvents = () => {

        stage.on('mousedown touchstart', function (e) {
            if (isTransforming || isFillSelect) return;
            isDrawing = true;
            var pos = stage.getPointerPosition();
            if (selectedShape === 'line' || selectedShape === 'rectangle' || selectedShape === 'circle') {
                createShape({ type: selectedShape, x: pos.x, y: pos.y }, layer);
            }
        });

        stage.on('mousemove touchmove', function (e) {
            if (!isDrawing || isFillSelect) return;
            document.getElementById('drawer').classList.add('hide');
            document.getElementById('swatch').classList.add('hide');
            var pos = stage.getPointerPosition();
            if (currentShape && (selectedShape === 'line' || selectedShape === 'rectangle' || selectedShape === 'circle')) {
                if (selectedShape === 'line') {
                    var newPoints = currentShape.points().concat([pos.x, pos.y]);
                    currentShape.points(newPoints);
                } else if (selectedShape === 'rectangle') {
                    var width = pos.x - currentShape.x();
                    var height = pos.y - currentShape.y();
                    currentShape.width(width);
                    currentShape.height(height);
                } else if (selectedShape === 'circle') {
                    var radius = Math.sqrt(Math.pow(pos.x - currentShape.x(), 2) + Math.pow(pos.y - currentShape.y(), 2));
                    currentShape.radius(radius);
                }
                layer.batchDraw();
                document.getElementById('clear').classList.remove('disabled');
            }
        });

        stage.on('mouseup touchend', function (e) {
            isDrawing = false;
            document.getElementById('drawer').classList.remove('hide');
            document.getElementById('swatch').classList.remove('hide');
        });

        stage.on('click tap', function (e) {
            if (isFillSelect) {
                e.target.fill(selectedColor);
            }
        });
    }


    const createShape = (data) => {
        const shape = Shape[data.type](data, layer);
        //shapeEvents(shape);
        layer.add(shape);
        layer.draw();
        currentShape = shape;
        shapes.push(shape);
    }

    const shapeEvents = (shape, eventType) => {

        shape[eventType]('mouseover', function () {
            document.body.style.cursor = 'move';
        });

        shape[eventType]('mouseout', function () {
            document.body.style.cursor = 'default';
        });

        shape[eventType]('click tap', function (e) {
            if (isTransforming) {
                transformer.nodes([e.target]);
            }
        });

    }

    const init = (id) => {
        stage, layer = null;
        currentShape = null;
        shapes = [];
        isDrawing = false;
        isTransforming = false;
        selectedShape = 'line';
        transformer = null;
        selectedColor = "#4285f4";
        isFillSelect = false;
        createStage(id);
        layer = new Konva.Layer();
        stage.add(layer);
    }

    const selectShape = (shapeName) => {
        currentShape = null;
        isTransforming = false;
        isFillSelect = false;
        isDrawing = true;
        selectedShape = shapeName;
        shapes.forEach((shape) => {
            shape.setAttr("draggable", false);
            shapeEvents(shape, 'off');
        });
    }

    const selectTransform = () => {
        if (isTransforming) return;
        isFillSelect = false;
        isTransforming = true;
        isDrawing = false;
        transformer = new Konva.Transformer();
        layer.add(transformer);
        shapes.forEach((shape) => {
            shape.setAttr("draggable", true);
            shapeEvents(shape, 'on');
        })
    }

    const selectText = () => {
        currentShape = null;
        isFillSelect = false;
        isTransforming = false;
        isFillSelect = false;
        isDrawing = true;
    }

    const selectFill = () => {
        isFillSelect = true;
        isDrawing = false;
        isTransforming = false;
    }

    const fillColor = (color) => {
        selectedColor = color;
    }

    const clear = () => {
        init('container');
    }

    const updateStroke = (value) => {
        strokeWidth = value;
    }

    return {
        init: init,
        selectShape: selectShape,
        selectTransform: selectTransform,
        selectText: selectText,
        selectFill: selectFill,
        fillColor: fillColor,
        updateStroke: updateStroke,
        clear:clear,
    };
})();

const toolbar = (() => {
    let item = 1;
    let limit = 8;
    let pageIndex = 1;
    let pageLimit = pageIndex * limit;

    let selectedColor = "#4285f4";

    const colors = [
        '#4285f4',
        '#2dd354',
        '#fcd015',
        '#f7931e',
        '#ef4037',
        '#b442cc',
        '#1a1a1a',
        '#ffffff',
        '#e6e6e6',
        '#b3b3b3',
        '#666666',
        '#472929',
        '#98643d',
        '#d19046',
        '#ffc382',
        '#ffdcb4',
        '#2828ea',
        '#6bfeda',
        '#2ff42f',
        '#eefd54',
        '#ff00ff',
        '#e0bfe6',
        '#149588',
        '#0071bc',
        '#662d91',
        '#2e3192',
        '#0071bc',
        '#29abe2',
        '#00ffff',
        '#00a99d',
        '#22b573',
        '#006837',
        '#ea7fb9',
        '#c1272d',
        '#ed1c24',
        '#f15a24',
        '#fbb03b',
        '#fcee21',
        '#d9e021',
        '#8cc63f'
    ];

    const menuItems = {
        "transform": (e) => {
            drawing.selectTransform();
            selectMenuEvent('transform');
        },
        "pencil": (e) => {
            drawing.selectShape("line");
            selectMenuEvent('line');
        },
        "type": (e) => {
            drawing.selectText();
            selectMenuEvent('type');
        },
        "fill": (e) => {
            drawing.selectFill();
            selectMenuEvent('fill');
        },
        "shape": (e) => {
            drawing.selectShape("rectangle");
            selectMenuEvent('shape');
        },
        "swatchx": (e) => {

        },
        "undo": (e) => { },
        "clear": (e) => {
            if(document.getElementById('clear').classList.contains('disabled')){
                return;
            }
            drawing.clear();
            document.getElementById('clear').classList.add('disabled');
        }
    };

    const tools = document.querySelectorAll(".tool");
    tools.forEach((element) => {
        const img = element.querySelector("img");
        if (img) {
            img.addEventListener("click", menuItems[element.id]);
        } else {
            const swatch = element.querySelector(".swatch-fill");
            swatch.addEventListener("click", menuItems[element.id]);

        }

    })

    const fillColorEvent = (color) => {
        selectedColor = color;
        drawing.fillColor(selectedColor);
        const eleFill = document.getElementById("swatch-fill");
        eleFill.style = `background-color: ${selectedColor}`;
        if (!eleFill.classList.contains('active')) {
            eleFill.classList.add('active');
        }
        eleFill.innerHTML = '';
    }

    const buildSwatches = (event, wrapContent) => {
        wrapContent.innerHTML = '';
        for (let i = item - 1; i < pageLimit; i++) {
            const element = document.createElement('div');
            element.style = `background-color:${colors[i]};${colors[i] === '#ffffff' ? 'border-color:#e6e6e6;' : ''}`;
            element.className = `swatch ${selectedColor === colors[i] ? 'active' : ''}`;
            element.addEventListener(event, (e) => {
                fillColorEvent(colors[i]);
                e.preventDefault();
                e.stopPropagation();
            });
            wrapContent.appendChild(element);
        }
    }

    const ele = document.getElementsByClassName("swatch");
    if (ele) {
        swatchEle = ele[0];
        'click touchstart'.split(' ').forEach(event => swatchEle.addEventListener(event, (e) => {
            const eleFill = document.getElementById("swatch-fill");
            const swatchTemp = document.getElementById("swatches-template");
            const content = document.importNode(swatchTemp.content, true);
            const wrapContent = content.getElementById("swatch-wrap-content");

            buildSwatches(event, wrapContent);
            eleFill.innerHTML = '';
            eleFill.appendChild(content);
            const rightArrow = document.getElementById("right-arrow");
            if (rightArrow) {
                rightArrow.addEventListener(event, (e) => {
                    item = limit + item; // 9
                    pageIndex++; //2
                    pageLimit = pageIndex * limit;
                    const docWrapContent = eleFill.querySelector("#swatch-wrap-content");
                    buildSwatches(event, docWrapContent);

                    if (pageLimit >= colors.length) {
                        pageLimit = colors.length;
                        rightArrow.classList.add('disabled');
                    }
                    leftArrow.className = '';
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });
            }

            const leftArrow = document.getElementById("left-arrow");
            if (leftArrow) {
                leftArrow.addEventListener(event, (e) => {
                    item = item - limit;
                    pageIndex--;
                    pageLimit = pageIndex * limit;
                    const docWrapContent = document.getElementById("swatch-wrap-content");
                    buildSwatches(event, docWrapContent);
                    if (pageLimit <= 8) {
                        pageLimit = 8;
                        leftArrow.classList.add('disabled');
                    }
                    rightArrow.className = '';
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });
            }

            document.addEventListener('click', (e) => {
                const eleFill = document.getElementById("swatch-fill");
                eleFill.innerHTML = '';
                e.stopImmediatePropagation();
            }, { 'once': true });

            e.stopPropagation();
            e.stopImmediatePropagation();
        }));
    }

    document.getElementById('drawer').addEventListener('click', (e) => {
        const toolbar = document.getElementById("toolbar").classList.add("open");
        document.getElementById('drawer').classList.add('open');
        e.stopPropagation();
        document.addEventListener('click', (e) => {
            document.getElementById("toolbar").classList.remove("open");
            document.getElementById('drawer').classList.remove('open');
            e.stopImmediatePropagation();
        }, { 'once': true });
    });

    document.getElementById('strokeRange').addEventListener('input', (e) => {
        drawing.updateStroke(e.target.value);
    });
    const selectMenuEvent = (selectedMenuId) => {
        const sourceEle = document.getElementById(selectedMenuId);
        const destEle = document.getElementById('drawer');
        destEle.innerHTML = sourceEle.innerHTML;
        let img = destEle.querySelector("img");
        img.src = img.src.replace('.svg', '-on.svg');

        document.querySelectorAll('.menu-item').forEach((ele) => {
            ele.classList.remove('active');
            let img = ele.querySelector("img");
            img.src = img.src.replace('-on.svg', '.svg');
        });
        sourceEle.classList.add('active');
        sourceEle.classList.add('active');
        img = sourceEle.querySelector("img");
        img.src = img.src.replace('.svg', '-on.svg');
    }

    return {
        selectMenuEvent: selectMenuEvent
    };
})();

drawing.init('container');


