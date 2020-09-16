
(function() {

    Vue.component("image-information", {
        template: "#image-information",
        props: ["imageId"],
        data: function () {
            return {
                heading: "here is a test heading",
            };
        },
        mounted: function () {
            console.log('component is mounted!!! 🦆');
            console.log("this.imageId of component: ", this.imageId);

            axios.get('/information')
                .then(function(resp) {
                    // i guess, the object i'll get from the server with the
                    // information about the clicked image and should
                    // store it in the data of the component
                })
                .catch(err => console.log('err in GET /information script.js: ', err));
        },

        // here i will probably need a function to hide the image component
    });

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
                    .catch(err => console.log('err from POST /upload: ', err));
            },

            handleChange: function(e) {
                // put the image into the data objeact 
                this.file = e.target.files[0];
            },

            handleClickOnImage: function(id) {
                console.log('IMAGE ID INSIDE OF handleClickOnImage: ', id);

                this.showModal = true;
                this.imageId = id;
            }

        }

    }); // closes Vue obj





})();