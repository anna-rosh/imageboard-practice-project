
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

        mounted: function() {
            this.showModal();
        },

        watch: {
            imageId: function() {
                this.showModal();   
            }
        },

        methods: {
            handleClickOnAddComment: function(e) {
                e.preventDefault();

                var commentData = {
                    username: this.username,
                    comment: this.comment
                };

                var that = this;
                // while i am doing this post request i am sending along
                // the data from input fields. I have access to them
                // because of v-model in html => it transefers them automatically to data of this component
                axios.post('/comment/' + that.imageId, commentData)
                    .then((result) => {
                        that.comments.unshift(result.data);
                    })
                    .then(function() {
                        that.clearInputFields();
                    })
                    .catch(function(err) {
                        console.log('err in POST /comment script.js: ', err);
                    });
            },

            clicked: function() {
                this.$emit('clicked');
            },

            showModal: function() {
                const that = this;
                // pass the imageId as a route parameter to GET
                // index.js will have the access to this value in req.params

                axios
                    .get("/information/" + that.imageId)
                    .then(function (resp) {
                        if (!resp.data) {
                            location.hash = "";
                            that.imageId = null;
                        }
                        // store the obj returned from the server request in the data
                        // of the component to access it in index.html
                        that.currentImageInfo = resp.data;
                    })
                    .catch(function (err) {
                        console.log(
                            "err in GET /information script.js: ",
                            err
                        );
                    });

                axios
                    .get("/comments/" + that.imageId)
                    .then(function (resp) {
                        // console.log("RESP IN GET /COMMENTS: ", resp);
                        that.comments = resp.data.comments;
                    })
                    .catch(function (err) {
                        console.log(
                            "err in get /comments script.js: ",
                            err
                        );
                    });
            },

            clearInputFields: function() {
                this.username = '';
                this.comment = '';
            }

        }, // closes methods

    }); // closes component


    new Vue({
        el: "main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            imageId: location.hash.slice(1)
        },
        mounted: function () {
            var that = this;
            axios
                .get("/images")
                .then(function (resp) {
                    // console.log('response from GET /images: ', resp);
                    that.images = resp.data.images;

                    window.addEventListener('hashchange', function() {
                        that.imageId = location.hash.slice(1);
                    });

                })
                .then(function () {
                    that.checkScrollPosition();
                })
                .catch(function (err) {
                    console.log("err in get /images: ", err);
                });
        },

        methods: {
            handleClick: function (e) {
                e.preventDefault();

                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                var that = this;

                axios
                    .post("/upload", formData)
                    .then(function (resp) {
                        // here I am getting response from the server (POST /upload)
                        // => that is an obj with the inserted row from the database
                        that.images.unshift(resp.data);
                    })
                    .then(function() {
                        that.clearInputFields();
                    })
                    .catch(function (err) {
                        console.log("err from POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                // put the image into the data objeact
                this.file = e.target.files[0];
            },

            closeModal: function () {
                this.imageId = '';
                location.hash = '';
            },

            showMoreImages: function () {
                // get the lowest id among the current images on the page
                var lowestId = this.images[this.images.length - 1].id;
                var that = this;

                axios
                    .get("/more-images/" + lowestId)
                    .then(function (result) {
                        for (var i = 0; i < result.data.length; i++) {
                            that.images.push(result.data[i]);
                        }
                        that.checkScrollPosition();
                    })
                    .catch(function (err) {
                        console.log("err in get /more-images: ", err);
                    });
            },

            checkScrollPosition: function () {
                var that = this;
                setTimeout(function () {
                    if (
                        window.innerHeight + window.pageYOffset >=
                        document.body.clientHeight - 500
                    ) {
                        that.showMoreImages();
                    } else {
                        that.checkScrollPosition();
                    }
                }, 500);
            },

            clearInputFields: function() {
                this.title = '';
                this.username = '';
                this.description = '';
                this.file = null;
                document.getElementById("file-upload-btn").innerHTML =
                    "⬆ choose an image";
            },

            showTitle: function(e) {
                var currIndex = this.$refs.cards.indexOf(e.currentTarget);
                this.$refs.titles[currIndex].style.opacity = '1';
            },

            hideTitle: function(e) {
                var currIndex = this.$refs.cards.indexOf(e.currentTarget);
                this.$refs.titles[currIndex].style.opacity = "0";
            }

        }, // closes methods
    }); // closes Vue obj


    // change the text of the choose image button after the image was selected
    document.getElementById('file-upload').addEventListener('change', function() {
        document.getElementById('file-upload-btn').innerHTML = '⬆ an image selected';
    });


})();