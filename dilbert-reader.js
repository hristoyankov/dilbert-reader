if (Meteor.isClient) {
    var get_random_date = function(end) {
        var start = new Date(1989, 04, 16); // First dilbert issue!
        var diff = end.getTime() - start.getTime();
        var new_diff = diff * Math.random();
        return new Date(start.getTime() + new_diff);
    }
    
    var get_dilbert_url = function(date) {
        return 'http://dilbert.com/strip/' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
    }

    Template.strip.onRendered(function () {
        Meteor.call('get_dilbert_strip', get_dilbert_url(new Date()), function(err, response) {
            if (err)
                console.log(err);
            else {
                Session.set('last_dilbert_strip', response);
                console.log(response);
            }
        });
    });
    Template.strip.helpers({
        dilbert_strip_url: function () {
            return Session.get('last_dilbert_strip').img_url;
        },
        dilbert_strip_title: function () {
            return Session.get('last_dilbert_strip').title;
        }
    });

    Template.strip.events({
        "click #randomDilbert": function() {
            Meteor.call('get_dilbert_strip', get_dilbert_url(get_random_date(new Date())), function(err, response) {
                if (err)
                    console.log(err);
                else
                    Session.set('last_dilbert_strip', response);
            });
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.methods({
            get_dilbert_strip: function (url) {
                var data = Scrape.website(url);

                return {title: data.title, img_url: data.image};
            }
        });

        
    });
}
