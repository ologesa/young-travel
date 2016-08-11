import DS from 'ember-data';

export default DS.Model.extend({
    hotels: DS.hasMany('hotel')

});
