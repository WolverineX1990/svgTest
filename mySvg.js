(function(win){

	var svg = {};
	var svgns = "http://www.w3.org/2000/svg";
	//基本容器
    var myMap = function(id,height,width)
    {
       var div = document.getElementById(id);
       //清空div
       div.innerHTML="";
       var _map=document.createElementNS(svgns,'svg');

  	   _map.setAttribute("id","map");
       if(height)
          _map.setAttribute('height',height);
       if(width)
          _map.setAttribute('width',width);
         
  	   this.El = _map;
  	   this.layerIds = [];

       div.appendChild(_map);
       this._init();
    }
   
    svg.map = myMap;
    
    myMap.prototype._init = function()
    {
       this.graphicsLayer = new MySvg.graphicsLayer("draw_layer");
       this.addLayer(this.graphicsLayer);

       $(this.El).on('DOMMouseScroll',this.scrollFun);
       var svg = this;
       this.El.onmousewheel = function(ev){
         var oEvent = ev||event;
         svg.scrollFun.call(svg, oEvent);
       };
    }

    myMap.prototype.scrollFun = function(ev)
    {
       // this.graphicsLayer.clear();
       if(this.zoomTimer)
         return;
       var n = 1;
       var map = this;
       function test()
       {
         debugger;
         var minX = ev.offsetX - 15/n;
         var maxX = ev.offsetX + 15/n;
         var minY = ev.offsetY - 10/n;
         var maxY = ev.offsetY + 10/n;
         map.graphicsLayer.clear();
         var pl1 = new svg.polyLine(minX+','+(minY+5/n)+' '+minX+','+minY+' '+(minX+5/n)+','+minY);
         var pl2 = new svg.polyLine((maxX-5/n)+','+minY+' '+maxX+','+minY+' '+maxX+','+(minY+5/n));
         var pl3 = new svg.polyLine(maxX+','+(maxY-5/n)+' '+maxX+','+maxY+' '+(maxX-5/n)+','+maxY);
         var pl4 = new svg.polyLine((minX+5/n)+','+maxY+' '+minX+','+maxY+' '+minX+','+(maxY-5/n));
         map.graphicsLayer.addGraphics([pl1,pl2,pl3,pl4]);
         if(n==3)
         {
           map.graphicsLayer.clear();
           map.zoomTimer = null;
           clearInterval(timer);
         }
         n++;
       }

       var timer = setInterval(test,150);
       map.zoomTimer = timer;
    }

    myMap.prototype.addLayer = function(layer,index)
    {
    	this.El.appendChild(layer.El);
    	this.layerIds.push(layer.id);
    }

    myMap.prototype.removerLayerById = function(id)
    {
      var layerEl = this.El.getElementById("id");
      if(layerEl)
      	this.El.removeChild(layerEl);
    }

    myMap.prototype.removerAllLayers = function()
    {
       if(this.layerIds.length>0)
       {
         this.El.innerHTML = "";
       	 this.layerIds = [];
       }
    }

    myMap.prototype.zoomOut = function()
    {

    }

    myMap.prototype.zoomIn = function()
    {
      
    }

    myMap.prototype.zoomOut = function()
    {

    }
    //渲染层
    var myGraphicsLayer = function(id)
    {
      var g = document.createElementNS(svgns,'g');
  	  g.setAttribute("id",id);
  	  this.id = id;
  	  this.El = g;
    }
    
    svg.graphicsLayer = myGraphicsLayer;

    myGraphicsLayer.prototype.addGraphics=function(graphics)
    {
        var doc = this.El;
    	
    	 	for(var i=0;i<graphics.length;i++)
    	 	{
    	 		doc.appendChild(graphics[i].El); 
    	 	}	
    }

    myGraphicsLayer.prototype.clear=function()
    {
    	 this.El.innerHTML = "";
    }
    //点
    var myPoint = function(x,y)
    {
       var point = document.createElementNS(svgns, "circle"); 
  	   point.setAttribute("cx",x);
  	   point.setAttribute("cy",y);
  	   point.setAttribute("r",1);
  	   this.El = point;
  	   this.x = x;
  	   this.y = y;
    }
    
    svg.point = myPoint;
    //点
    var myLine = function(x1,y1,x2,y2)
    {
       var line = document.createElementNS(svgns, "line");
       line.setAttribute("x1", x1); 
  	   line.setAttribute("y1", y1); 
  	   line.setAttribute("x2", x2); 
  	   line.setAttribute("y2", x2); 
  	   line.setAttribute("stroke", "green");
  	   this.El = line;
  	   this.path = [new myPoint(x1,y1),new myPoint(x2,y2)];
    }

    svg.line = myLine;
    //点
    var myPolyLine = function(str)
    {
       var pLine = document.createElementNS(svgns, "polyline");
       
       var pts = str.split(" ");
       
       var path = [];
       for(var i=0;i<pts.length;i++)
       {
       	 var p = pts[i].split(",");
       	 var pt = new myPoint(p[0],p[1]);
       	 path.push(pt);
       }

       pLine.setAttribute("points", str);
       pLine.setAttribute("fill", "none");
       pLine.setAttribute("stroke", "green");
  	   this.El = pLine;
  	   this.path = pts;
    }

    svg.polyLine = myPolyLine; 

    //点
    var myExtent = function(x,y,w,h,rx,ry)
    {
        var extent = document.createElementNS(svgns, "rect");
        extent.setAttribute("x", x);
        extent.setAttribute("y", y);
        extent.setAttribute("width",w);
        extent.setAttribute("height",h);
        if(rx)
          extent.setAttribute("rx",rx);
        if(ry)
          extent.setAttribute("ry",ry);
        extent.setAttribute("fill", "green");
	      this.El = extent;
        this.x = x;
        this.y = y;
        this.minX = x;
        this.minY = y;
        this.maxX = x + h;
        this.maxY = y + w;
	   /* var shape = document.createElementNS(svgns, "rect");
    shape.setAttributeNS(null, "x", 5);
    shape.setAttributeNS(null, "y", 5);
    shape.setAttributeNS(null, "rx", 5);
    shape.setAttributeNS(null, "ry", 5);
    shape.setAttributeNS(null, "width",  40);
    shape.setAttributeNS(null, "height", 40);
    shape.setAttributeNS(null, "fill", "green");*/
    }

    svg.extent = myExtent;
    //点
    var myPolyGon = function(str)
    {
       var polygon = document.createElementNS(svgns, "polygon");
      
       var pts = str.split(" ");
       
       var rings = [];
       for(var i=0;i<pts.length;i++)
       {
       	 var p = pts[i].split(",");
       	 var pt = new myPoint(p[0],p[1]);
       	 rings.push(pt);
       }

       polygon.setAttribute("points", str);
       polygon.setAttribute("fill", "none");
       polygon.setAttribute("stroke", "green");
  	   this.El = polygon;
  	   this.rings = rings;
    }
    
    svg.polygon = myPolyGon;
    //点
    var myCircle = function(cx,cy,r)
    {
       var circle = document.createElementNS(svgns, "circle");
       circle.setAttribute("cx", cx);
       circle.setAttribute("cy", cy);
       circle.setAttribute("r", r);
       circle.setAttribute("fill", "green");
  	   this.El = circle;
  	   this.center = new myPoint(cx,cy);
    }
    svg.circle = myCircle;

    //点
    var myEllipse = function(cx,cy,rx,ry)
    {
    	  var ellipse = document.createElementNS(svgns, "ellipse");
        ellipse.setAttribute("cx", cx);
        ellipse.setAttribute("cy", cy);
        ellipse.setAttribute("rx", rx);
        ellipse.setAttribute("ry", ry);
        ellipse.setAttribute("fill", "green");
  	    this.El = ellipse;
  	    this.center = new myPoint(cx,cy);
    }
    
    /*
    *#DrawTool
    */
    var myDrawTool = function(map)
    {
    	this.dbType = ['polyline','polygon'];
    	this.activeAble = false;
    	this.map = map;
    	this.geo = null;
    }

    myDrawTool.prototype.active=function(drawType)
    {
    	// this.geometry = new eval("MySvg."+type)()
    	this.path ="";
    	this.activeAble = true;
    	this.drawType = drawType;
    	this.geo = null;
    	switch(drawType)
    	{
    		case "line":
            svg.drawUtils.drawLine(this);
    		break;
    		case "circle":
            svg.drawUtils.drawCircle(this);
    		break;
    		case "point":
            svg.drawUtils.drawPoint(this);
    		break;
    		case "polygon":
            svg.drawUtils.drawPolygon(this);
    		break;
    		case "polyline":
            svg.drawUtils.drawPolyLine(this);
    		break;
    		case "extent":
            svg.drawUtils.drawExtent(this);
    		break;
    		case "ellipse":
            svg.drawUtils.drawEllipse(this);
    		break;

    	}   	
    }

    myDrawTool.prototype.deactive=function()
    {
    	this.activeAble = false;
    }

    svg.drawTool = myDrawTool;

    svg.ellipse = myEllipse;

    win.MySvg = svg;

    svg.drawUtils = {
    	drawPoint : function(drawTool)
    	{
          addEventHandler(drawTool.map.El,"click",drawEnd);
          function drawEnd(evt)
    	    {
    	        if(!drawTool.activeAble) return;
    	        removeEventHandler(drawTool.map.El,"click",drawEnd);
    	        var obj = {'geometry':new myPoint(evt.offsetX,evt.offsetY),'type':drawTool.drawType}
              drawTool.drawEnd(obj);
          }
    	},
    	drawLine : function(drawTool)
    	{
          var layer = drawTool.map.graphicsLayer;

          addEventHandler(drawTool.map.El,"mousedown",drawStar);
          addEventHandler(drawTool.map.El,"mouseup",drawEnd);

          function drawStar(evt)
  	    	{
  	    		  addEventHandler(drawTool.map.El,"mousemove",onmousemove);
  	    	    drawTool.geo = new myLine(evt.offsetX,evt.offsetY,evt.offsetX,evt.offsetY);
              layer.addGraphics([drawTool.geo]);
  	    	}
            
          function onmousemove(evt)
          {
          	 drawTool.geo.El.setAttribute("x2",evt.offsetX);
          	 drawTool.geo.El.setAttribute("y2",evt.offsetY);
          }

  	    	function drawEnd(evt)
  	    	{
  	    		  removeEventHandler(drawTool.map.El,"mousedown",drawStar);
              removeEventHandler(drawTool.map.El,"mouseup",drawEnd);
              removeEventHandler(drawTool.map.El,"mousemove",onmousemove);
  	    		  if(!drawTool.activeAble) return;
  	    	    var obj = {'geometry':drawTool.geo,'type':drawTool.drawType}
  	    	    layer.clear();
  	          drawTool.drawEnd(obj);
  	    	}
    	},
    	drawPolyLine : function(drawTool)
    	{
           var layer = drawTool.map.graphicsLayer;

           addEventHandler(drawTool.map.El,"click",drawStar);
           addEventHandler(drawTool.map.El,"dblclick",drawEnd);

           function drawStar(evt)
           {
           	  if(!drawTool.geo)
           	  {
           	     addEventHandler(drawTool.map.El,"mousemove",onmousemove);
                 drawTool.geo = new myPolyLine(evt.offsetX+","+evt.offsetY);
                 layer.addGraphics([drawTool.geo]);
              }

              drawTool.path +=evt.offsetX+","+evt.offsetY+" ";
           }

           function onmousemove(evt)
           {
               var tempPath = drawTool.path+" " + evt.offsetX+","+evt.offsetY;
		           drawTool.geo.El.setAttribute("points",tempPath);
           }

           function drawEnd(evt)
	         {
	    	       removeEventHandler(drawTool.map.El,"mousedown",drawStar);
               removeEventHandler(drawTool.map.El,"mouseup",drawEnd);
               removeEventHandler(drawTool.map.El,"mousemove",onmousemove);
	    	       var obj = {'geometry':drawTool.geo,'type':drawTool.drawType}
	    	       layer.clear();
	             drawTool.drawEnd(obj);
	    	   }
    	},
    	drawPolygon : function(drawTool)
    	{
           var layer = drawTool.map.graphicsLayer;

           addEventHandler(drawTool.map.El,"click",drawStar);
           addEventHandler(drawTool.map.El,"dblclick",drawEnd);

           function drawStar(evt)
           {
           	  if(!drawTool.geo)
           	  {
           	     addEventHandler(drawTool.map.El,"mousemove",onmousemove);
                 drawTool.geo = new myPolyGon(evt.offsetX+","+evt.offsetY);
                 layer.addGraphics([drawTool.geo]);
              }

              drawTool.path +=evt.offsetX+","+evt.offsetY+" ";
           }

           function onmousemove(evt)
           {
               var tempPath = drawTool.path+" " + evt.offsetX+","+evt.offsetY;
		           drawTool.geo.El.setAttribute("points",tempPath);
           }

           function drawEnd(evt)
	         {
	    	       removeEventHandler(drawTool.map.El,"mousedown",drawStar);
               removeEventHandler(drawTool.map.El,"mouseup",drawEnd);
               removeEventHandler(drawTool.map.El,"mousemove",onmousemove);
	    	       layer.clear();
	    	       var obj = {'geometry':drawTool.geo,'type':drawTool.drawType}
	    	       layer.clear();
	             drawTool.drawEnd(obj);
	    	   }
    	},
    	drawExtent : function(drawTool)
    	{
           var layer = drawTool.map.graphicsLayer;

            addEventHandler(drawTool.map.El,"mousedown",drawStar);
            addEventHandler(drawTool.map.El,"mouseup",drawEnd);

            function drawStar(evt)
	    	    {
	    	  	    addEventHandler(drawTool.map.El,"mousemove",onmousemove);
	    	        drawTool.geo = new myExtent(evt.offsetX,evt.offsetY,0,0);
              	layer.addGraphics([drawTool.geo]);
	    	    }
            
            function onmousemove(evt)
            {
            	 var w = evt.offsetX - drawTool.geo.x;
	           	 var h = evt.offsetY - drawTool.geo.y;
	           	 drawTool.geo.El.setAttribute("width",w);
	           	 drawTool.geo.El.setAttribute("height",h);
               drawTool.geo.maxX = drawTool.geo.minX + w;
               drawTool.geo.maxY = drawTool.geo.minY + h;
            }

    	    	function drawEnd(evt)
    	    	{
    	    		  removeEventHandler(drawTool.map.El,"mousedown",drawStar);
                removeEventHandler(drawTool.map.El,"mouseup",drawEnd);
                removeEventHandler(drawTool.map.El,"mousemove",onmousemove);
    	    		  if(!drawTool.activeAble) return;
    	    		  layer.clear();
    	    	    var obj = {'geometry':drawTool.geo,'type':drawTool.drawType}
    	    	    layer.clear();
    	          drawTool.drawEnd(obj);
    	    	}
    	},
    	drawCircle : function(drawTool)
    	{
         var layer = drawTool.map.graphicsLayer;

          addEventHandler(drawTool.map.El,"mousedown",drawStar);
          addEventHandler(drawTool.map.El,"mouseup",drawEnd);

          function drawStar(evt)
  	    	{
  	    		  addEventHandler(drawTool.map.El,"mousemove",onmousemove);
  	    	    drawTool.geo = new myCircle(evt.offsetX,evt.offsetY,0);
              layer.addGraphics([drawTool.geo]);
  	    	}
          
          function onmousemove(evt)
          {
          	 var x = evt.offsetX - drawTool.geo.center.x;
           	 var y = evt.offsetY - drawTool.geo.center.y;
           	 var r = Math.sqrt(x*x+y*y);
           	 drawTool.geo.El.setAttribute("r",r);
          }

  	    	function drawEnd(evt)
  	    	{
  	    		  removeEventHandler(drawTool.map.El,"mousedown",drawStar);
              removeEventHandler(drawTool.map.El,"mouseup",drawEnd);
              removeEventHandler(drawTool.map.El,"mousemove",onmousemove);
  	    		  if(!drawTool.activeAble) return;
  	    	    var obj = {'geometry':drawTool.geo,'type':drawTool.drawType}
  	    	    layer.clear();
  	          drawTool.drawEnd(obj);
  	    	}
    	},
    	drawEllipse : function(drawTool)
    	{
        var layer = drawTool.map.graphicsLayer;

        addEventHandler(drawTool.map.El,"mousedown",drawStar);
        addEventHandler(drawTool.map.El,"mouseup",drawEnd);

        function drawStar(evt)
	    	{
	    		 addEventHandler(drawTool.map.El,"mousemove",onmousemove);
	    	   drawTool.geo = new myEllipse(evt.offsetX,evt.offsetY,0,0);
           layer.addGraphics([drawTool.geo]);
	    	}
            
        function onmousemove(evt)
        {
        	 var rx = Math.abs(evt.offsetX - drawTool.geo.center.x);
         	 var ry = Math.abs(evt.offsetY - drawTool.geo.center.y);
         	 drawTool.geo.El.setAttribute("rx",rx);
         	 drawTool.geo.El.setAttribute("ry",ry);
        }

	    	function drawEnd(evt)
	    	{
	    		  removeEventHandler(drawTool.map.El,"mousedown",drawStar);
            removeEventHandler(drawTool.map.El,"mouseup",drawEnd);
            removeEventHandler(drawTool.map.El,"mousemove",onmousemove);
	    		  if(!drawTool.activeAble) return;
	    		  layer.clear();
	    	    var obj = {'geometry':drawTool.geo,'type':drawTool.drawType}
	    	    layer.clear();
	          drawTool.drawEnd(obj);
	    	}
    	}
    }
})(window)