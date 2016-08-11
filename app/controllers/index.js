import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        click: function(evt) {
            switch(evt){
                case "fab-add":
                    fabAdd();
                    break;
            }

        }
    }
});

function fabAdd(){
    
}