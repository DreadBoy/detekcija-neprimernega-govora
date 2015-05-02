var _ = require('lodash');

module.exports = new function Klasifikacija() {
    var that = this;

    function PR(frekR, V) {
        return function P(frek) {
            return Math.log((frek + 1) / (frekR + V));
        }
    }

    var klas = [];

    that.klasificiraj = function (primerni, neprimerni, test) {

        //Pripravljen R funkcija
        var P = {
            primerni: PR(primerni.frekvenceTotal, primerni.frekvenceTotal + neprimerni.frekvenceTotal),
            neprimerni: PR(neprimerni.frekvenceTotal, primerni.frekvenceTotal + neprimerni.frekvenceTotal)
        };

        //testiraj vsaki stavek
        for (stavek in test.stavki) {

            //tu boš sešeteval verjetnosti za vse besede v stavki
            var Pstavek = {
                primerni: 0,
                neprimerni: 0
            };

            //Razdeli stavek na besede
            var besede = _.words(test.stavki[stavek])
                .map(function (beseda) {
                    return beseda.toLowerCase();
                });


            besede
                //izračunaj obe verjetnosti za besedo
                .map(function (beseda) {
                    var frekvenca = {
                        primerni: 0,
                        neprimerni: 0
                    };
                    //primerja besedo z obema korpusoma in najde ustrezne frekvence
                    var potencialna = {
                        primerni: primerni.frekvence.filter(function (f) {
                            return f.kljuc === beseda;
                        }),
                        neprimerni: neprimerni.frekvence.filter(function (f) {
                            return f.kljuc === beseda;
                        })
                    };

                    //če najde besede, shrani frekvenco
                    if (potencialna.primerni.length > 0)
                        frekvenca.primerni = potencialna.primerni[0].frekvenca;
                    if (potencialna.neprimerni.length > 0)
                        frekvenca.neprimerni = potencialna.neprimerni[0].frekvenca;

                    //izračunaj verjetnost s pomočjo pripravljenih formul
                    var ret = {
                        primerni: P.primerni(frekvenca.primerni),
                        neprimerni: P.neprimerni(frekvenca.neprimerni)
                    };

                    //vrni frekvence
                    return ret;

                })
                //za vsako besedo prištej njeno verjetnost k verjetnosti za cel stavek
                .forEach(function (P) {
                    Pstavek.primerni += P.primerni;
                    Pstavek.neprimerni += P.neprimerni;
                });

            //pomnožim s faktorjem
            //Pstavek.primerni *= primerni.frekvenceTotal / (primerni.frekvenceTotal + neprimerni.frekvenceTotal);
            //Pstavek.neprimerni *= neprimerni.frekvenceTotal / (primerni.frekvenceTotal + neprimerni.frekvenceTotal);

            /*
            console.log(test.stavki[stavek]);
            console.log("Komentar je " + (test.comments[test.stavki[stavek]] == 1 ? "primeren" : "neprimeren") + ".");
            console.log("Primerni: " + Pstavek.primerni + ", Neprimerni: " + Pstavek.neprimerni);
            console.log("Komentar naj bi bil " + (Pstavek.primerni > Pstavek.neprimerni ? "primeren" : "neprimeren") + ".");
            console.log("\n");
            */

            klas.push({
                dejanski: test.comments[test.stavki[stavek]],
                predviden: (Pstavek.primerni > Pstavek.neprimerni ? 1 : -1),
                text: test.stavki[stavek]
            });

        }
        return that;
    };

    that.F1_Score = function () {
        //izračunaj precision
        //izračunaj recall


        //vsi negativni komentarji
        var relevant = klas.filter(function (k) {
            return k.dejanski === -1;
        });

        //vsi negativni komentarji glede na klasifikacijo
        var retrieved = klas.filter(function (k) {
            return k.predviden === -1;
        });

        var precision = _.intersection(relevant, retrieved).length / retrieved.length;
        var recall = _.intersection(relevant, retrieved).length / relevant.length;

        var F1 = 2 * (precision * recall) / (precision + recall);



        return F1;
    };
    
    return that;
};

function intersectionObjects2(a, b, areEqualFunction) {
    var results = [];

    for(var i = 0; i < a.length; i++) {
        var aElement = a[i];
        var existsInB = _.any(b, function(bElement) { return areEqualFunction(bElement, aElement); });

        if(existsInB) {
            results.push(aElement);
        }
    }

    return results;
}

function intersectionObjects() {
    var results = arguments[0];
    var lastArgument = arguments[arguments.length - 1];
    var arrayCount = arguments.length;
    var areEqualFunction = _.isEqual;

    if(typeof lastArgument === "function") {
        areEqualFunction = lastArgument;
        arrayCount--;
    }

    for(var i = 1; i < arrayCount ; i++) {
        var array = arguments[i];
        results = intersectionObjects2(results, array, areEqualFunction);
        if(results.length === 0) break;
    }

    return results;
}

_.mixin({ 'intersectionObjects': intersectionObjects });