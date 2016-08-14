import Model from 'ember-data/model';
import DS from 'ember-data';

export default Model.extend({
    name: DS.attr('string'),
    stars: DS.attr('number'),
    price: DS.attr('number'),
    currency: DS.attr('string'),
    ratingBooking : DS.attr('number'),
    ratingTripAdvisor: DS.attr('number'),
    travelTime : DS.attr('number'),
    attractions : DS.attr('number'),
    
});
