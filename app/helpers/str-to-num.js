import Ember from 'ember';

export function strToNum(params/*, hash*/) {
    if (params.length !== 1) {
        throw new Error("Handlerbars Helper 'strToNum' needs 1 parameter");
    }
    return parseInt(params[0]);
}

export default Ember.Helper.helper(strToNum);
