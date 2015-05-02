var _ = require('lodash');

function Korpus() {
    var that = this;

    that._stavki = [];
    that._frekvence = [];
    that.frekvenceTotal;
    that.comments = {};

    //izračunaj frekvence za ta korpus
    that.izracunajFrekvence = function () {

        var frekvenceObj = that.stavki
            //razdeli stavek na besede
            .map(_.words)
            //splošči jagged array
            .reduce(function (a, b) {
                return a.concat(b);
            })
            //spremeni besede v lowecase
            .map(function (beseda) {
                return beseda.toLowerCase();
            })
            //preštej besede in jih shrani v object
            .reduce(function (acc, curr) {
                if (typeof acc[curr] == 'undefined') {
                    acc[curr] = 1;
                } else {
                    acc[curr] += 1;
                }

                return acc;
            }, {});

        var frekvence = [];

        //mapiraj frekvence v array, da jih lahko sortiraš
        for (key in frekvenceObj) {
            if (frekvenceObj.hasOwnProperty(key)) {
                frekvence.push({kljuc: key, frekvenca: frekvenceObj[key]})
            }
        }
        //padajoče sortiraj frekvence
        frekvence.sort(function (a, b) {
            return (a.frekvenca > b.frekvenca ) ? -1 : ((b.frekvenca > a.frekvenca) ? 1 : 0);
        });

        //seštej vse frekvence
        that.frekvenceTotal = frekvence.reduce(function (a, b) {
            return {frekvenca: a.frekvenca + b.frekvenca};
        }).frekvenca;

        that._frekvence = frekvence;
    }
}

Korpus.prototype = {
    get frekvence() {
        if (this._frekvence.length > 0)
            return this._frekvence;
        else {
            this.izracunajFrekvence();
            return this._frekvence;
        }
    },
    set stavki(stavki) {
        this._stavki = stavki;
        this.izracunajFrekvence();
    },
    get stavki() {
        return this._stavki;
    }
};

module.exports = new function Data() {
    var that = this;

    that.train = {
        primerni: new Korpus(),
        neprimerni: new Korpus()
    };

    that.test = new Korpus();

    return that;
};