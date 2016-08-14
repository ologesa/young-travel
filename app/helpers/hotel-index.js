import Ember from 'ember';

export function hotelIndex(params/*, hash*/) {

    if (params.length !== 1) {
        throw new Error("Handlerbars Helper 'hotelIndex' needs 1 parameter");
    }
    var count = 1 + parseInt(params[0]);

    if (count === 0) {
        return '';
    }

    let suffix;
    switch (count % 10) {
        case 1:
            suffix = "st"; break;
        case 2:
            suffix =  "nd"; break;
        case 3:
            suffix =  "rd"; break;
        default:
            suffix =  "th"; break;
    }

    if(count === 11 || count === 12 || count === 13) {
        suffix =  "th";
    }

    return new Ember.Handlebars.SafeString(count + "<sup>" + suffix + "</sup> hotel");
}

export default Ember.Helper.helper(hotelIndex);
