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
            stars: 0,
            price: 0,
            currency: 'EUR',
            ratingBooking: 0,
            ratingTripAdvisor: 0
        });
        sess.get('hotels').pushObject(hotel);

        hotel.save().then(() => sess.save());
    },
    deleteF: function (element) {

        var model = this.get("model");
        var store = this.get('store');
        var sess = store.peekRecord('session', model.id);
        sess.get('hotels').find(x => x.id === element).destroyRecord();

    }
});



