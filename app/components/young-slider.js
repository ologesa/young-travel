import Ember from 'ember';
const DELTA = 5;         // only report moves of greater than five pixels
const DELTA_TIME = 10;  // only report moves every 100ms

export default Ember.Component.extend({
    classNameBindings : ["className"],
    
    
    // Remember previous coordinates and time.
    initialX: null,
    lastX: null,
    lastY: null,
    lastTime: null,
    imgId: "handle" + Math.floor(Math.random() * 100000) + 1,
    mouseMoveFunction : null,
    mouseUpFunction : null,
    getImage(event){
        var viewElements = event.element;
        var images = viewElements.getElementsByTagName("img");
        var imgId = this.imgId;

        var img = null;
        Ember.$.each(images, function (index, item) {
            if (item.id === imgId) {
                img = item;
                return false;
            }
        });


        return img;
    },

    mouseCurry(eventFunction, data){

        return function (event) {
            eventFunction(event, data);
        };
    },

    actions : {

        // Set up and tear down event listeners.
        mousedown: function (event) {

            this.setProperties({ lastX: null, lastY: null, initialX : null});

            if(!this.mouseMoveFunction) {
                this.mouseMoveFunction = this.mouseCurry(this.mousemove, {controller: this.controller, img: this.getImage(event)});
            }

            if(!this.mouseUpFunction) {
                var data = {controller: this.controller, document: event.element.ownerDocument};
                this.mouseUpFunction = this.mouseCurry(this.mouseup, data);
                data.mouseMoveFunction = this.mouseMoveFunction;
                data.mouseUpFunction = this.mouseUpFunction;
            }


            event.element.ownerDocument.addEventListener('mousemove', this.mouseMoveFunction);
            event.element.ownerDocument.addEventListener('mouseup', this.mouseUpFunction);
            console.log("mouseDown");
        },


    },
    mouseup: function (event, data) {
        data.controller.setProperties({ lastX: null, lastY: null, initialX : null});

        data.document.removeEventListener('mousemove', data.mouseMoveFunction);
        data.document.removeEventListener('mouseup', data.mouseUpFunction);

        console.log("mouseUp");
    },
    mousemove: function (event, data) {

        var { screenX, screenY } = event;
        var { lastX, lastY, initialX, lastTime } = data.controller.getProperties('lastX', 'lastY', 'initialX',  'lastTime');
        var now = +new Date();

        if(!lastX || !lastY || !initialX ){
            lastX = screenX;
            initialX = screenX;
            lastY = screenY;
            data.controller.setProperties({ lastX: screenX, lastY: screenY, initialX : initialX, lastTime: now });
        }


        if (Math.abs(screenX - lastX) < DELTA && Math.abs(screenY - lastY) < DELTA || now - lastTime < DELTA_TIME) {
            return;
        }
        data.img.style.marginLeft = (lastX - initialX)  + "px";
        data.controller.setProperties({ lastX: screenX, lastY: screenY, lastTime: now });
        console.log("mouseMove "  + lastX + " " + initialX);

    }

});
