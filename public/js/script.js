
(function() {

    new Vue({
        el: 'main',
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null
        },
        mounted: function() {
            var vueObj = this;
            axios
                .get('/images')
                .then(function(resp) {
                    // console.log('response from GET /images: ', resp);
                    vueObj.images = resp.data.images;
                })
                .catch(function(err) {
                    console.log('err in get /images: ', err);
                });
        },

        methods: {
            handleClick: function(e) {
                e.preventDefault();

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                var vueObj = this;

                axios
                    .post('/upload', formData)
                    .then(function(resp) {
                        // here I am getting response from the server (POST /upload)
                        // => that is an obj with the inserted row from the database
                        // console.log('RESPONSE IN AXIOS: ', resp);

                        // console.log('images array', vueObj.images);
                        vueObj.images.unshift(resp.data);
                    })
                    .catch(err => console.log('err from POST /upload: ', err));
            },

            handleChange: function(e) {
                // put the image into the data objeact 
                this.file = e.target.files[0];
            }
        }

    }); // closes Vue obj





})();