
(function() {

    new Vue({
        el: 'main',
        data: {
            heading: 'name of the page',
            subHeading: 'latest images',
            images: []
        },
        mounted: function() {
            var vueObj = this;
            axios
                .get('/images')
                .then(function(resp) {
                    vueObj.images = resp.data.images;
                })
                .catch(function(err) {
                    console.log('err in get /images: ', err);
                });
        }

    }); // closes Vue obj





})();