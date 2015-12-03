if (Meteor.isClient) {
    Template.strip.onRendered(function () {
        Meteor.call('get_dilbert_strip', function(err, response) {
            if (err)
                console.log(err)
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
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Meteor.methods({
            get_dilbert_strip: function () {
                console.log('In get_dilbert_strip');
                var data = Scrape.website("http://www.dilbert.com/strip/2015-12-04");

                return {title: data.title, img_url: data.image};
            }
        });

        
    });
}
