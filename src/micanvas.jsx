import React, { useEffect } from 'react';

import { fabric } from 'fabric'



const Micanvas = () => {
  let micanvas = ''
  let activeGrid = false

  const activateRule =()=>{
    let createdElements = micanvas.getObjects().find((element)=>element.cacheKey==='numbers');
    
    if(createdElements!==undefined){  
      micanvas.getObjects().map((element) => {
        if ( element.cacheKey === 'numbers') {micanvas.remove(element)}
      })
      rule()
    }else rule()
    
  }
    
  const handleGrid =()=>{
    activeGrid = !activeGrid
    activateRule()
    grid()
    canvasZoom()
  }

  const rule= () => {
    let rulerPosition=micanvas.calcViewportBoundaries().tl
    let objects = micanvas.getObjects().find((element)=>element.cacheKey==='numbers');
    let zoom = micanvas.getZoom()
    let fontSize = 10
    let nBig=3
     
    if(zoom>1.6){fontSize=8;nBig = 2}
    if(zoom>3){fontSize=6;nBig = 1.5}
    if(zoom>4.5){fontSize=5;nBig = 0.5}
    if(zoom>6){fontSize=4;nBig = 0.5}
    if(zoom>10){fontSize=3; nBig = 0}
    if(zoom>15){fontSize=2; nBig = 0} 

    if(objects===undefined){
      if ( activeGrid === true) {
        let padding = 0;
        let top = 0
        for (let i = 0; i <= 30; i++) {
          if(i===1)nBig+=1
          if(i===10)nBig+=1
          if(i===10 && zoom > 15)nBig-=0.5
          
          let numero = new fabric.Text(i.toString(), {
            top: rulerPosition.y,
            left:padding - nBig,
            fontWeight: 'normal',
            fontSize: fontSize,
            fontStyle: 'italic',
            fontFamily: 'Delicious',
            selectable: false,
            evented: false,
            cacheKey: 'numbers'
          })
          
          padding+= 23.58490566
          micanvas.add( numero)
        }

        for (let i = 0; i <= 30; i++) {
          
          let number = new fabric.Text(i.toString(), {
          top: top - 10,
          left:rulerPosition.x,
          fontWeight: 'normal',
          fontSize: fontSize,
          fontStyle: 'italic',
          fontFamily: 'Delicious',
          selectable: false,
          evented: false,
          cacheKey: 'numbers'
          
          
          })
          
          top += 23.58490566;
          micanvas.add( number)
        }
      }
    }
  }

  const grid = () => {
    if ( activeGrid === true) {
      let padding = 0;
      let top = 0
      let darkLine = 0

      for (let i = 0; i <= 100; i++) {

        let strokeWidth = 0.03
        if (darkLine === 5) strokeWidth = 0.06
        if (darkLine === 10 || darkLine === 0) {strokeWidth = 0.1; darkLine = 0 }

        let rect = new fabric.Rect({
          left:padding,
          top: 0,
          strokeWidth: strokeWidth,
          stroke: 'black',
          width: 0,
          height: 2000,
          selectable: false,
          evented: false,
          cacheKey: 'grid'
        });

        padding += 4.716981132;
        darkLine++
        strokeWidth = 0.01
        micanvas.add(rect)
      }

      for (let i = 0; i <= 100; i++) {
        let strokeWidth = 0.03

        if(darkLine === 5) {strokeWidth = 0.06 }

        if(darkLine=== 10 || darkLine === 0) {strokeWidth = 0.1;darkLine = 0}

        let rect = new fabric.Rect({
          left: 0,
          top: top,
          strokeWidth: strokeWidth,
          stroke: 'black',
          width: 2000,
          height: 0,
          selectable: false,
          evented: false,
          cacheKey: 'grid'
        });
        top += 4.716981132;
        darkLine++;
        strokeWidth = 0.01
        micanvas.add(rect)
      }


    } else {
      let object = micanvas.getObjects()
      object.map((element) => { if (element.cacheKey === 'grid' ) micanvas.remove(element)})
    }
  }

  const circle = () => {
    let circle = new fabric.Circle({radius: 10, fill: 'green', left: 0, top: 0 });
    circle.bringToFront()
    micanvas.add(circle)
  }


  const canvasZoom = () => {

    micanvas.on('mouse:down',  (ev)=> {
      let evt = ev.e;
      if (evt.altKey === true) {
        micanvas.isDragging = true;
        micanvas.selection = false;
        micanvas.lastPosX = evt.clientX;
        micanvas.lastPosY = evt.clientY;
      }
    });

    micanvas.on('mouse:move', (ev)=> {
      if (micanvas.isDragging) {
        let e = ev.e;
        let vpt = micanvas.viewportTransform;
        vpt[4] += e.clientX - micanvas.lastPosX;
        vpt[5] += e.clientY - micanvas.lastPosY;
        micanvas.requestRenderAll();
        micanvas.lastPosX = e.clientX;
        micanvas.lastPosY = e.clientY;
      }
      activateRule()
    });

    micanvas.on('mouse:up',(ev)=> {
      micanvas.setViewportTransform(micanvas.viewportTransform);
      micanvas.isDragging = false; 
    });


    micanvas.on('mouse:wheel',(ev)=> {
      let delta = ev.e.deltaY;

      let zoom = micanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 30) zoom = 30;
      if (zoom < 1) zoom = 1;
      micanvas.zoomToPoint({ x: ev.e.offsetX, y: ev.e.offsetY }, zoom);

      ev.e.preventDefault();
      ev.e.stopPropagation();

      let vpt = micanvas.viewportTransform;
      if (zoom < 400 / 1000) {
        vpt[4] = 200 - 1000 * zoom / 2;
        vpt[5] = 200 - 1000 * zoom / 2;
      } else {
        if (vpt[4] >= 0) {
          vpt[4] = 0;
        } else if (vpt[4] < micanvas.getWidth() - 1000 * zoom) {
          vpt[4] = micanvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          vpt[5] = 0;
        } else if (vpt[5] < micanvas.getHeight() - 1000 * zoom) {
          vpt[5] = micanvas.getHeight() - 1000 * zoom;
        }
      };
      
      activateRule()

    });

  }

  useEffect(() => {
    let c = document.getElementById('c')
    micanvas = new fabric.Canvas(c, { width: 500, height: 400})
    micanvas.setBackgroundImage('bg/bg1.jpg', (img) => { micanvas.renderAll(img);  }, { scaleX: 0.59, scaleY: 0.9})
  }, [])

  return (
    <>
      <canvas id='c'></canvas>
      <button onClick={handleGrid}>Cuadricula</button>
      <button onClick={circle}>circulo</button>
      <p>Zoom con la rueda del mouse <br/>Arrastrar con alt+mouse down</p>

    </>
  )
}
export default Micanvas
