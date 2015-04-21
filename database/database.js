var mongoose = require('mongoose'),
    CommentModel = rekuire('database/CommentModel'),
    async = require('async');

var db = mongoose.connect('mongodb://jt:jt@kahana.mongohq.com:10016/pesek');

var cache = new function Cache() {
    var that = this;

    that.test = {
        primerni: [],
        neprimerni: []
    };
    that.train = {
        primerni: [],
        neprimerni: []
    };

    return that;
};

module.exports = new function Database() {
    var that = this;

    that.getTrainData = function (callback) {

        if (cache.train.neprimerni.length > 0 && cache.train.primerni.length > 0)
            callback(null, cache.train);

        async.parallel([
                function (callback) {
                    CommentModel.find({type: -1}, function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null, data.slice(0, data.length / 3).map(function(comment){
                                return comment.text;
                            }));
                    });
                },
                function (callback) {
                    CommentModel.find({type: 1}, function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null, data.slice(0, data.length / 3).map(function(comment){
                                return comment.text;
                            }));
                    });
                }
            ],
            function (err, results) {
                if (err)
                    callback(err);
                else {
                    cache.train.neprimerni = results[0];
                    cache.train.primerni = results[1];
                    callback(err, cache.train);
                }
            });
    };
    return that;
};
