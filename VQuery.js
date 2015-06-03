(function(win){
  function VQuery(vArg)
  {
     this.elements = [];
     switch(typeof vArg)
     {
        case "function":
        myAddEvent(window,"load",vArg);
        break;
      case "string":
        switch(vArg.charAt(0))
      {
        case '#': //ID
          var obj = document.getElementById(vArg.substr(1));
          this.elements.push(obj);
          break;
        case '.': //class
          this.elements = getByClass(document,vArg.substr(1));
          break;
        default: //tagName
           this.elements = document.getElementsByTagName(vArg);
      }
        break;
      case "object":
        this.elements.push(vArg);
     }
  }

  function getByClass(oParent,sClass)
  {
    var aEle = oParent.getElementsByTagName("*");
    var aResult = [];
    for(var i=0;i<aEle.length;i++)
    {
      if(aEle[i].calssName==sClass)
      {
         aResult.push(aEle[i]);
      }
    }
    return aResult;
  }

  function getStyle(obj,attr)
  {
    if(obj.currentStyle)
      return obj.currentStyle[attr];
    else
      return getComputedStyle(obj,false)[attr];
  }

  VQuery.prototype.click=function(fn)
  {
    for(var i=0;i<this.elements.length;i++)
    {
       myAddEvent(this.elements[i],'click',fn);
    }
  };

  VQuery.prototype.show=function()
  {
     for(var i=0;i<this.elements.length;i++)
     {
        this.elements[i].style.display="block";
     }
  };

  VQuery.prototype.hide=function()
  {
     for(var i=0;i<this.elements.length;i++)
     {
       this.elements[i].style.display='none';
     }
  };

  VQuery.prototype.hover=function(fnOver,fnOut)
  {
     for(var i=0;i<this.elements.length;i++)
     {
        myAddEvent(this.elements[i],'mouseover',fnOver);
        myAddEvent(this.elements[i],'mouseout',fnOut);
     }
  };

  VQuery.prototype.css=function(attr,value)
  {
     if(arguments.length==2)
     {
        for(var i=0;i<this.elements.length;i++)
        {
          this.elements[i].style[attr] = value;
        }
     }
     else
     {
        return getStyle(this.elements[0],attr);
     }
  };

  VQuery.prototype.attr = function(attr,value)
  {
     if(arguments.length==2)
     {
        for(var i=0;i<this.elements.length;i++)
        {
          this.elements[i].attr = value; 
        }
     }
     else
       return this.elements[0][attr];
  };

  VQuery.prototype.toggle=function()
  {
     var _arguments = arguments;
     for(var i=0;i<this.elements.length;i++)
     {
       addToggle(this.elements[i]);
     }
     
     function addToggle(obj)
     {
       var count = 0;
       myAddEvent(obj,'click',function(){
       _arguments[count++%_arguments.length].call(obj);
     });
     }
  };

  VQuery.prototype.eq = function(n)
  {
     return $(this.elements[n]);
  };

  function appendArr(arr1,arr2)
  {
     for(var i=0;i<arr2.length;i++)
     {
       arr1.push(arr2[i]);
     }
  }

  VQuery.prototype.find = function(str)
  {
    var aResult = [];

    for(var i=0;i<this.elements.length;i++)
    {
      switch(str.charAt(0))
      {
        case '.': //class
          var aEle = getByClass(this.elements[i]);
          appendArr(aResult,aEle);
          break;
        default :
          var aEle = this.elements[i].getElementsByTagName(str);
          appendArr(aResult,aEle);
      }
    }

    var newVquery = VQuery();
    newVquery.elements = aResult;
    return newVquery;
  }

  VQuery.prototype.on = function(type,fn){
    for(var i=0;i<this.elements.length;i++)
    {
       addEventHandler(this.elements[i],type,fn);
    }
  }

  VQuery.prototype.un = function(type){
    for(var i=0;i<this.elements.length;i++)
    {
       removeEventHandler(this.elements[i],type,fn);
    }
  }

  function addEventHandler(target,sEv,fn)
  {
     if(target.attachEvent)
     {
        obj.attachEvent('on'+sEv,function(){
        fn.call(obj);
        });
     }
     else if(target.addEventListener)
     {
        target.addEventListener(sEv,fn,false);
     }
     else
        target["on" + sEv] = fn;
  }

  function removeEventHandler(target, type, func) {
      if (target.removeEventListener)
          target.removeEventListener(type, func, false);
      else if (target.detachEvent)
      {
          target.detachEvent("on" + type, function(){
             fn.call(obj);
           });
      }
      else delete target["on" + type];
  }

  function $(vArg)
  {
    return new VQuery(vArg);
  }

  win.VQuery = VQuery;
  win.$ = $;
})(window)

// String的trim方法
String.prototype.trim=function()
{
  return this.replace(/^\s+|\s+$/g,'');
}

function addEventHandler(target,sEv,fn)
{
   if(target.attachEvent)
   {
      obj.attachEvent('on'+sEv,function(){
      fn.call(obj);
      });
   }
   else if(target.addEventListener)
   {
      target.addEventListener(sEv,fn,false);
   }
   else
      target["on" + sEv] = fn;
}

function removeEventHandler(target, type, func) {
  if (target.removeEventListener)
      target.removeEventListener(type, func, false);
  else if (target.detachEvent)
  {
      target.detachEvent("on" + type, function(){
         fn.call(obj);
       });
  }
  else delete target["on" + type];
}