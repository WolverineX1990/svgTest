(function(win){
	var testSvg;
    var layer;
	win.appInit = function(){

        testSvg = new MySvg.map('mySvg','600px','800px');
		layer = new MySvg.graphicsLayer("layer1");
		testSvg.addLayer(layer);

        $('#pointBtn').on('click',function(){
            drawTool.active("point");
        });

        $('#lineBtn').on('click',function(){
            drawTool.active("line");
        });

        $('#polygonBtn').on('click',function(){
            drawTool.active("polygon");
        });

        $('#rectBtn').on('click',function(){
            drawTool.active("extent");
        });

        $('#circleBtn').on('click',function(){
            drawTool.active("circle");
        });

        $('#ellipseBtn').on('click',function(){
            drawTool.active("ellipse");
        });

        $('#polylineBtn').on('click',function(){
            drawTool.active("polyline");
        });

        $('#clearBtn').on('click',function(){
            layer.clear();
            drawTool.deactive();
        });

        $('#zoomOutBtn').on('click',function(){
            drawTool.active("extent");
            drawTool.drawEnd = function(evt){
                var h = evt.geometry.maxX - evt.geometry.minX;
                testSvg.El.setAttribute("viewBox",evt.geometry.minX+" "+evt.geometry.minY+" "+h+" "+4/3*h);
            }
        });

        $('#zoomInBtn').on('click',function(){
            testSvg.El.setAttribute("viewBox","0 0 "+800+" "+600);
        });

        var drawTool = new MySvg.drawTool(testSvg);
        drawTool.drawEnd = function(evt)
        {
           layer.addGraphics([evt.geometry]);
           if(evt.type == 'polyline')
             return;
           addEventHandler(evt.geometry.El,'click',function(evt){
                 evt.target.setAttribute("fill", "red");
           });
           addEventHandler(evt.geometry.El,'mouseover',function(evt){
                 evt.target.setAttribute("fill", "yellow");
           });
           addEventHandler(evt.geometry.El,'mouseout',function(evt){
                 evt.target.setAttribute("fill", "green");
           });
        }
	}
})(window)