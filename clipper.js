function clipper() {
    var isIe = false, D=document, clippedElements, position=0, box, undoLink, undoAllLink, moveLink, exitLink;
    /*@cc_on isIe = true; @*/
    function forEach(arr, fn) {
        var i, l = arr.length;
        for (i=0; i<l; i++) {
            fn(arr[i]);
        }
    }
    function attachEvent(el, n, fn, ix) {
        function wrapperFunction(ev){
            var el = (isIe?window.event.srcElement:ev.target);
            if (ix || !el.doNotRemoveOnClick) {
                fn(el);
            }
        }
        if (isIe){
            n = 'on' + n;
            el.attachEvent(n, wrapperFunction);
        } else {
            el.addEventListener(n, wrapperFunction, false);
        }
        if (!el.es) {
            el.es=[];
        }
        el.es.push(function() {
            if(isIe){
                el.detachEvent(n,wrapperFunction);
            } else {
                el.removeEventListener(n, wrapperFunction, false);
            }
        });
        el.removeEvent = function() {
            forEach(el.es, function(f) {
                f();
            });
        };
    }
    function saveEventHandlers(el) {
        var oldClick = el.onclick, oldMouseUp = el.onmouseup, oldMouseDown = el.onmousedown;
        el.onclick = function() {
            return false;
        };
        el.onmouseup = function() {
            return false;
        };
        el.onmousedown = function() {
            return false;
        };
        el.restoreEventHandlers = function() {
            el.onclick=oldClick;
            el.onmouseup=oldMouseUp;
            el.onmousedown=oldMouseDown;
        };
    }
    if (!window._clippedElements) {
        window._clippedElements=[];
    }
    clippedElements = window._clippedElements;
    
    attachEvent(D.body,'mouseover', function(el) {
        el.style.backgroundColor='#ffff99';
        saveEventHandlers(el);
    });
    attachEvent(D.body,'mouseout', function(el) {
        el.style.backgroundColor='';
        if(el.restoreEventHandlers) {
            el.restoreEventHandlers();
        }
    });
    attachEvent(D.body, 'click', function(el) {
        el.style.display='none';
        clippedElements.push(el);
    });
    function appendChild(parent,tagName,html) {
        var e=D.createElement(tagName);
        if(html){
            e.innerHTML=html;
        }
        parent.appendChild(e);
        return e;
    }
    box=appendChild(D.body,'div');
    box.style.cssText='position:'+(isIe?'absolute':'fixed')+';padding:2px;background-color:#99FF99;border:1px solid green;z-index:9999;font-family:sans-serif;font-size:10px';
    function setPositionOfBox(){
        box.style.top    = (position&2) ? '' : '10px';
        box.style.bottom = (position&2) ? '10px' : '';
        box.style.left   = (position&1) ? '' : '10px';
        box.style.right  = (position&1) ? '10px' : '';
    }
    setPositionOfBox();
    
    undoLink=appendChild(box,'a',' Undo |');
    attachEvent(undoLink,'click',function(){
        var e=clippedElements.pop();
        if(e){
        	e.style.display='';
        }
    }, true);
    
    undoAllLink=appendChild(box,'a',' Undo All |');
    attachEvent(undoAllLink,'click',function(){
        var e;
        while(e=clippedElements.pop()){
            e.style.display='';
        }
    }, true);
    
    moveLink=appendChild(box,'a',' Move |');
    attachEvent(moveLink,'click',function(){
        position++;
        setPositionOfBox();
    }, true);
    
    exitLink=appendChild(box,'a',' Exit ');
    attachEvent(exitLink,'click',function(){
        D.body.removeEvent();
        box.parentNode.removeChild(box);
    }, true);
    
    forEach([box,undoLink,moveLink,exitLink,undoAllLink],function(e){
        e.style.cursor='pointer';
        e.doNotRemoveOnClick=1;
    });
}