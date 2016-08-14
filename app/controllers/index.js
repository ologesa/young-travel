import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        click: function (evt, element) {
            switch (evt) {
                case "fab-add":
                    let fabAdd = this.get('fabAdd');
                    fabAdd.call(this);
                    break;
                case "delete":
                    let deleteF = this.get('deleteF');
                    deleteF.call(this, element);
                    break;
            }
        },
        blur : function(evt, element){
            var saveHotel = this.get('saveHotel');
            saveHotel.call(this, element);
        },
        change: function(evt, element, event){
            debugger;
            var value = event.target.options[event.target.selectedIndex].value;


            var setSelectedAttraction = this.get('setSelectedAttraction');
            setSelectedAttraction.call(this, element, value);

            var saveHotel = this.get('saveHotel');
            saveHotel.call(this, element);
        }


    },
    fabAdd: function () {
        var model = this.get("model");
        var store = this.get('store');
        var sess = store.peekRecord('session', model.id);
        var lastId = 0;
        sess.get('hotels').forEach(function (x) {
            if (x.id > lastId) {
                lastId = x.id;
            }
        });
        var hotel = store.createRecord('hotel', {
            id: lastId + 1,
            name: '',
            stars: '',
            price: '',
            currency: 'EUR',
            ratingBooking: '',
            ratingTripAdvisor: '',
            attractions: 3
        });
        sess.get('hotels').pushObject(hotel);

        hotel.save().then(() => sess.save());
    },
    deleteF: function (element) {

        var model = this.get("model");
        var store = this.get('store');
        var sess = store.peekRecord('session', model.id);
        sess.get('hotels').find(x => x.id === element).destroyRecord();

    },

    setSelectedAttraction: function (id, value){
        var model = this.get("model");
        var store = this.get('store');
        var sess = store.peekRecord('session', model.id);
        var hotel = sess.get('hotels').find(x => x.id === id);
        hotel.set("attractions", value);
    },

    saveHotel: function(id){
        var model = this.get("model");
        var store = this.get('store');
        var sess = store.peekRecord('session', model.id);
        var hotel = sess.get('hotels').find(x => x.id === id);
        if(hotel.hasDirtyAttributes){
            hotel.save();
        }
    }
});


