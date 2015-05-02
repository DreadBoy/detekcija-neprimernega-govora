var mongoose = require('mongoose'),
    CommentModel = rekuire('database/CommentModel'),
    async = require('async'),
    data = rekuire('database/data');

var db = mongoose.connect('mongodb://jt:jt@kahana.mongohq.com:10016/pesek');

module.exports = new function Database() {
    var that = this;

    that.getTrainData = function (callback) {

        if (data.train.neprimerni.stavki.length > 0 && data.train.primerni.stavki.length > 0)
            callback(null, data.train);

        async.parallel([
                function (callback) {
                    CommentModel.find({type: -1}, function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null, data.slice(0, data.length * 2 / 3).map(function(comment){
                                return comment.text;
                            }));
                    });
                },
                function (callback) {
                    CommentModel.find({type: 1}, function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null, data.slice(0, data.length * 2 / 3).map(function(comment){
                                return comment.text;
                            }));
                    });
                },
                function (callback) {
                    CommentModel.find({type: 1}, function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null, data.slice(data.length * 2 / 3, data.length));
                    });
                },
                function (callback) {
                    CommentModel.find({type: -1}, function (err, data) {
                        if (err)
                            callback(err);
                        else
                            callback(null, data.slice(data.length * 2 / 3, data.length));
                    });
                }
            ],
            function (err, results) {
                if (err)
                    callback(err);
                else {
                    data.train.neprimerni.stavki = results[0];
                    data.train.primerni.stavki = results[1];
                    var test = results[2].concat(results[3]);
                    data.test.stavki = test.map(function (comment) {
                        return comment.text;
                    });
                    test.forEach(function (comment) {
                        data.test.comments[comment.text] = comment.type;
                    });
                    callback(err, data);
                }
            });
    };

    that.export = function (callback) {
        CommentModel.find({}, callback);
    };
    return that;
};
