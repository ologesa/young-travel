import Ember from 'ember';


const DELTA_TIME = 1;  // only report moves every 10ms

//noinspection JSUnusedGlobalSymbols
export default Ember.Component.extend({
    classNameBindings : ["className"],
    
    
    // Remember previous coordinates and time.
    initialX: null,
    lastX: null,
    lastY: null,
    lastTime: null,
    width: 0,
    marginLeft: 90,
    initialMarginLeft: 90,
    imgId: "handle" + Math.floor(Math.random() * 100000) + 1,
    eventMoveFunction : null,
    eventUpFunction : null,
    getImage(event){
        var viewElements = event.element;
        var images = viewElements.getElementsByTagName("img");
        var imgId = this.get("imgId");

        var img = null;
        Ember.$.each(images, function (index, item) {
            if (item.id === imgId) {
                img = item;
                return false;
            }
        });


        return img;
    },

    eventCurry(eventFunction, data){

        var that = this;
        return function (event) {
             eventFunction.call(that, event, data);
        };
    },

    actions : {
        eventDown: function (method, event) {

            this.setProperties({ lastX: null, lastY: null, initialX : null});


            var eventCurry = this.get("eventCurry");
            var getImage = this.get("getImage");

            var img = getImage.call(this, event);
            this.$(img).removeClass("hSliderHandle");
            if(!this.eventMoveFunction) {
                this.eventMoveFunction = eventCurry.call(this, this.get("eventMove"), {img: img, method: method });
            }

            if(!this.eventUpFunction) {
                var data = {document: event.element.ownerDocument, img: img, method: method};
                this.eventUpFunction = eventCurry.call(this, this.get("eventUp"), data);
                data.eventMoveFunction = this.eventMoveFunction;
                data.eventUpFunction = this.eventUpFunction;
            }

            this.set("width", this.$().width());
            this.set("initialMarginLeft", this.get("marginLeft"));
            event.element.ownerDocument.addEventListener(method === "mouse" ?  "mousemove" : "touchmove", this.eventMoveFunction);
            event.element.ownerDocument.addEventListener(method === "mouse" ? "mouseup" : "touchend", this.eventUpFunction);

            return false;
        }
    },
    eventUp: function (event, data) {

        this.$(data.img).addClass("hSliderHandle");

        this.setProperties({ lastX: null, lastY: null, initialX : null});

        data.document.removeEventListener(data.method === "mouse" ?  "mousemove" : "touchmove", data.eventMoveFunction);
        data.document.removeEventListener(data.method === "mouse" ? "mouseup" : "touchend" + 'up', data.eventUpFunction);

    },
    eventMove: function (event, data){
        this.moveToEventCoordonates.call(this, event, data);
    },

    moveToEventCoordonates: function (event, data) {
        //event.preventDefault();
        var screenX, screenY;


        if(data.method === "mouse") {
            screenX = event.screenX;
        } else {
            var touch = event.touches[0] || event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];

            screenX = touch.screenX;
        }
        var { initialX, lastTime } = this.getProperties('initialX',  'lastTime');
        var now = +new Date();

        this.setProperties({lastTime: now });
        if(!initialX ){
            initialX = screenX;
            this.setProperties({ initialX : initialX});
        }


        if (now - lastTime < DELTA_TIME) {
            return;
        }

        
        var marginLeft = this.get("initialMarginLeft") + screenX - initialX;

        if(marginLeft < 0) {
            marginLeft = 0;
        }

        var usableWidth = this.get("width") - data.img.width;
        if(marginLeft > usableWidth) {
            marginLeft = usableWidth;
        }

        data.img.style.marginLeft =  marginLeft + "px";
        this.setProperties({marginLeft : marginLeft});

    }
});

