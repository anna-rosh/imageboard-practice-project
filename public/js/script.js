
(function() {

    Vue.component("image-information", {
        template: "#image-information",
        props: ["imageId"],
        data: function () {
            return {
                heading: "here is a test heading",
                currentImageInfo: null,
                username: "",
                comment: "",
                comments: [],
            };
        },
        mounted: function () {
            // console.log("component is mounted!!! 🦆");
            // console.log("this.imageId of component: ", this.imageId);
            const that = this;
            // pass the imageId as a route parameter to GET
            // index.js will have the access to this value in req.params
            axios
                .get('/information/' + that.imageId)
                .then(function (resp) {
                    // store the obj returned from the server request in the data
                    // of the component to access it in index.html
                    that.currentImageInfo = resp.data;
                })
                .catch(function (err) {
                    console.log("err in GET /information script.js: ", err);
                });

            axios
                .get(`/comments/${that.imageId}`)
                .then(function (resp) {
                    console.log("RESP IN GET /COMMENTS: ", resp);
                    that.comments = resp.data.comments;
                })
                .catch(function (err) {
                    console.log("err in get /comments script.js: ", err);
                });
        }, // closes mounted
        methods: {
            handleClickOnAddComment: function(e) {
                e.preventDefault();

                var commentData = {
                    username: this.username,
                    comment: this.comment
                };

                var that = this;

                axios.post('/comment/' + that.imageId, commentData)
                    .then((result) => {
                        that.comments.unshift(result.data);
                    })
                    .catch(function(err) {
                        console.log('err in POST /comment script.js: ', err);
                    });
            }
        }, // closes methods

    }); // closes component


    new Vue({
        el: 'main',
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            showModal: false,
            imageId: null
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
                    .catch(function(err) {
                        console.log('err from POST /upload: ', err);
                    });
            },

            handleChange: function(e) {
                // put the image into the data objeact 
                this.file = e.target.files[0];
            },

            // called in index.html and gets it arg from main vue instance
            handleClickOnImage: function(id) {
                this.showModal = true;
                this.imageId = id;
            }

        }

    }); // closes Vue obj





})();