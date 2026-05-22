// Wait for the HTML to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. TOOL TAB NAVIGATION LOGIC
    // ==========================================
    const tabs = document.querySelectorAll('.tab-menu button');
    const panels = {
        'Images': document.querySelector('.panel-images'),
        'Text': document.querySelector('.panel-text'),
        'Clipart': document.querySelector('.panel-clipart'),
        'Shapes': document.querySelector('.panel-shapes')
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            Object.values(panels).forEach(panel => {
                if (panel) panel.style.display = 'none';
            });

            const tabName = tab.textContent.trim();
            if (panels[tabName]) {
                panels[tabName].style.display = 'flex'; 
            }
        });
    });

    // ==========================================
    // 2. CANVAS INIT & FRONT/BACK TOGGLE
    // ==========================================
    const canvas = new fabric.Canvas('product-canvas', {
        width: 400,  height: 469, preserveObjectStacking: true 
    });
    window.canvas = canvas; 

    const frontBtn = document.querySelector('.view-toggle button:nth-child(1)');
    const backBtn = document.querySelector('.view-toggle button:nth-child(2)');
    const productBgImg = document.querySelector('.product-image-background');
    let currentSide = 'Front';
    
    const canvasStates = { 'Front': null, 'Back': null };
    
    // MAGIC INTERCEPT: Check if Squarespace is passing us a live image URL!
    const urlParams = new URLSearchParams(window.location.search);
    const frontImageURL = urlParams.get('frontImage') || 'https://via.placeholder.com/400x469/EFEFEF/707070?text=Front+Mockup';
    
    // Set the back image to automatically copy the front image
    const backImageURL = frontImageURL; 

    const bgImages = {
        'Front': frontImageURL,
        'Back': backImageURL
    };
    
    // Set the initial image immediately on load
    productBgImg.src = bgImages['Front'];

    function switchSide(newSide) {
        if (newSide === currentSide) return; 
        canvasStates[currentSide] = canvas.toJSON(['requestedFont']);
        canvas.clear();

        if (newSide === 'Front') {
            frontBtn.classList.add('active'); backBtn.classList.remove('active');
            productBgImg.style.transform = 'scaleX(1)'; // Normal orientation
        } else {
            backBtn.classList.add('active'); frontBtn.classList.remove('active');
            productBgImg.style.transform = 'scaleX(-1)'; // Mirrored horizontally!
        }
        productBgImg.src = bgImages[newSide];

        if (canvasStates[newSide]) {
            canvas.loadFromJSON(canvasStates[newSide], () => canvas.renderAll());
        }
        currentSide = newSide;
        
        document.querySelector('.text-input-box').value = '';
        document.querySelector('.font-search-box').value = '';
        document.querySelector('.adobe-request-box').value = '';
    }

    frontBtn.addEventListener('click', () => switchSide('Front'));
    backBtn.addEventListener('click', () => switchSide('Back'));

    // ==========================================
    // 3. ADDING SHAPES TO CANVAS
    // ==========================================
    function addShape(shapeObject) {
        canvas.add(shapeObject);
        canvas.centerObject(shapeObject); 
        canvas.setActiveObject(shapeObject); 
        canvas.renderAll(); 
    }

    const shapeStyles = { fill: '#707070', cornerColor: '#00FFED', transparentCorners: false };

    document.querySelector('.square-button').addEventListener('click', () => { addShape(new fabric.Rect({ width: 100, height: 100, ...shapeStyles })); });
    document.querySelector('.circle-button').addEventListener('click', () => { addShape(new fabric.Circle({ radius: 50, ...shapeStyles })); });
    document.querySelector('.triangle-button').addEventListener('click', () => { addShape(new fabric.Triangle({ width: 100, height: 100, ...shapeStyles })); });
    document.querySelector('.rectangle-button').addEventListener('click', () => { addShape(new fabric.Rect({ width: 150, height: 80, ...shapeStyles })); });
    document.querySelector('.rounded-square-button').addEventListener('click', () => { addShape(new fabric.Rect({ width: 100, height: 100, rx: 20, ry: 20, ...shapeStyles })); });
    document.querySelector('.capsule-button').addEventListener('click', () => { addShape(new fabric.Rect({ width: 150, height: 70, rx: 35, ry: 35, ...shapeStyles })); });
    document.querySelector('.oval-button').addEventListener('click', () => { addShape(new fabric.Ellipse({ rx: 75, ry: 45, ...shapeStyles })); });
    document.querySelector('.star-button').addEventListener('click', () => {
        const star = new fabric.Polygon([{x: 30, y: 2}, {x: 38, y: 20}, {x: 58, y: 22}, {x: 43, y: 36}, {x: 47, y: 55}, {x: 30, y: 46}, {x: 13, y: 55}, {x: 17, y: 36}, {x: 2, y: 22}, {x: 22, y: 20}], shapeStyles);
        star.set({ scaleX: 2, scaleY: 2 }); addShape(star);
    });
    document.querySelector('.heart-button').addEventListener('click', () => {
        const heart = new fabric.Path('M30,55 l-4,-3.8C11.5,38,2,29.4,2,18.8 C2,10.1,8.8,3.2,17.2,3.2c4.8,0,9.3,2.2,12.8,5.8 c3.5,-3.6,8,-5.8,12.8,-5.8C51.2,3.2,58,10.1,58,18.8 c0,10.6,-9.5,19.2,-24.1,32.3L30,55z', shapeStyles);
        heart.set({ scaleX: 2, scaleY: 2 }); addShape(heart);
    });
    document.querySelector('.line-button').addEventListener('click', () => {
        addShape(new fabric.Line([5, 30, 155, 30], { stroke: '#707070', strokeWidth: parseInt(document.querySelector('.border-size-slider').value, 10), cornerColor: '#00FFED', transparentCorners: false }));
    });
    document.querySelector('.moon-button').addEventListener('click', () => {
        const moon = new fabric.Path('M50,30 A25,25 0 1,1 25,5 A18,18 0 1,0 50,30 z', shapeStyles);
        moon.set({ scaleX: 2, scaleY: 2 }); addShape(moon);
    });
    document.querySelector('.pentagon-button').addEventListener('click', () => {
        const pentagon = new fabric.Polygon([{x: 30, y: 2}, {x: 58, y: 22}, {x: 47, y: 56}, {x: 13, y: 56}, {x: 2, y: 22}], shapeStyles);
        pentagon.set({ scaleX: 2, scaleY: 2 }); addShape(pentagon);
    });
    document.querySelector('.diamond-button').addEventListener('click', () => {
        const diamond = new fabric.Polygon([{x: 30, y: 2}, {x: 55, y: 30}, {x: 30, y: 58}, {x: 5, y: 30}], shapeStyles);
        diamond.set({ scaleX: 2, scaleY: 2 }); addShape(diamond);
    });
    document.querySelector('.hexagon-button').addEventListener('click', () => {
        const hexagon = new fabric.Polygon([{x: 30, y: 2}, {x: 55, y: 16}, {x: 55, y: 44}, {x: 30, y: 58}, {x: 5, y: 44}, {x: 5, y: 16}], shapeStyles);
        hexagon.set({ scaleX: 2, scaleY: 2 }); addShape(hexagon);
    });
    document.querySelector('.octagon-button').addEventListener('click', () => {
        const octagon = new fabric.Polygon([{x: 17, y: 2}, {x: 43, y: 2}, {x: 58, y: 17}, {x: 58, y: 43}, {x: 43, y: 58}, {x: 17, y: 58}, {x: 2, y: 43}, {x: 2, y: 17}], shapeStyles);
        octagon.set({ scaleX: 2, scaleY: 2 }); addShape(octagon);
    });
    document.querySelector('.trapezoid-button').addEventListener('click', () => {
        const trapezoid = new fabric.Polygon([{x: 15, y: 10}, {x: 45, y: 10}, {x: 55, y: 50}, {x: 5, y: 50}], shapeStyles);
        trapezoid.set({ scaleX: 2, scaleY: 2 }); addShape(trapezoid);
    });

    document.querySelector('.trashcan-button').addEventListener('click', () => {
        const activeObject = canvas.getActiveObject(); 
        if (activeObject) {
            canvas.remove(activeObject); canvas.discardActiveObject(); canvas.renderAll(); 
        }
    });

    // ==========================================
    // 4. COLOR SELECTOR & BORDER SLIDER LOGIC
    // ==========================================
    const swatches = document.querySelectorAll('.color-swatch');
    const hexPopup = document.querySelector('.hex-code-popup'); 
    const hexInput = document.querySelector('.hex-code-box');

    const fillToggle = document.querySelector('.fill-toggle');
    const borderToggle = document.querySelector('.border-toggle');
    let colorMode = 'fill'; 

    const borderSliderRow = document.querySelector('.color-slider-row');
    const borderSizeSlider = document.querySelector('.border-size-slider');
    const borderSizeValue = document.querySelector('.border-size-value');

    fillToggle.addEventListener('click', () => {
        fillToggle.classList.add('active');
        borderToggle.classList.remove('active');
        colorMode = 'fill'; 
        borderSliderRow.style.display = 'none';
    });

    borderToggle.addEventListener('click', ()
