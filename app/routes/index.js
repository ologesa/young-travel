import Ember from 'ember';
import Guid from 'ember-cli-guid';


var service =  Ember.inject.service;

export default Ember.Route.extend({
    queryParams:{
        ys: {
            replace: true
        }
    },
    cookies: service(),
    moment: service(),
    model(params){
        var session_id = params.ys;

        if(!session_id) {
            let cookieService = this.get('cookies');
            let cookieValue = cookieService .read('ys');
            if(cookieValue){
                session_id = cookieValue;
            } else {
                let moment = this.get('moment');
                debugger;
                session_id = Guid.compact(Guid.create());
                cookieService.write('ys', session_id, {expires: moment.utc().add(1, 'y').toDate().toUTCString()});
            }

        }

        var store = this.get('store');
        return store.findRecord('session', session_id).then(function(object){
            return new Ember.RSVP.Promise(function(resolve/*, reject*/){
                resolve(object);
            });
        }, function(){
            return new Ember.RSVP.Promise(function(resolve/*, reject*/){
                var sess = {id: session_id};
                
                store.push(store.normalize("session", sess));
                resolve(sess);
            });
        });
    }
});