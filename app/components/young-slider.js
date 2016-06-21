import Ember from 'ember';


const DELTA_TIME = 10;  // only report moves every 100ms

export default Ember.Component.extend({
    classNameBindings : ["className"],
    
    
    // Remember previous coordinates and time.
    initialX: null,
    lastX: null,
    lastY: null,
    lastTime: null,
    width: 0,
    marginLeft: 0,
    initialMarginLeft: 0,
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

            var img = this.getImage(event);
            this.$(img).removeClass("hSliderHandle");
            if(!this.mouseMoveFunction) {
                this.mouseMoveFunction = this.mouseCurry(this.mousemove, {controller: this.controller, img: img});
            }

            if(!this.mouseUpFunction) {
                var data = {controller: this.controller, document: event.element.ownerDocument, img: img};
                this.mouseUpFunction = this.mouseCurry(this.mouseup, data);
                data.mouseMoveFunction = this.mouseMoveFunction;
                data.mouseUpFunction = this.mouseUpFunction;
            }

            this.set("width", this.$().width());
            this.set("initialMarginLeft", this.get("marginLeft"));
            event.element.ownerDocument.addEventListener('mousemove', this.mouseMoveFunction);
            event.element.ownerDocument.addEventListener('mouseup', this.mouseUpFunction);
        },


    },
    mouseup: function (event, data) {
        data.controller.$(data.img).addClass("hSliderHandle");
        data.controller.setProperties({ lastX: null, lastY: null, initialX : null});

        data.document.removeEventListener('mousemove', data.mouseMoveFunction);
        data.document.removeEventListener('mouseup', data.mouseUpFunction);

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


        if (now - lastTime < DELTA_TIME) {
            return;
        }

        var marginLeft = data.controller.get("initialMarginLeft") + lastX - initialX;

        if(marginLeft < 0) {
            marginLeft = 0;
        }

        var usableWidth = data.controller.get("width") - data.img.width;
        if(marginLeft > usableWidth) {
            marginLeft = usableWidth;
        }

        data.img.style.marginLeft =  marginLeft + "px";
        data.controller.setProperties({ lastX: screenX, lastY: screenY, lastTime: now, marginLeft : marginLeft});

    }

});

