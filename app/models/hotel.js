import Model from 'ember-data/model';
import DS from 'ember-data';

export default Model.extend({
    name: DS.attr('string'),
    stars: DS.attr('number'),
    price: DS.attr('price'),
    currency: DS.attr('number'),
    ratingBooking : DS.attr('number'),
    ratingTripAdvisor: DS.attr('number')
});
