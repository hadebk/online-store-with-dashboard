$(document).ready(function () {
  (function () {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      // <PUT YOUR FIREBASE CONFIG HERE>
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // global vars
    var productKEY,
      storeReferenceMainImage,
      fileMainImage,
      taskMainImage,
      secondaryImagesURLS = [],
      selectedColorsArray = [],
      selectedSizesArray = [],
      secondaryImagesArray = [];

    // Get ELements from html
    const product_name = document.getElementById("product_name");
    const product_price = document.getElementById("product_price");

    // read main image name, and create a reference to it in storage
    $(".main_image #imgInp").on("change", function (e) {
      fileMainImage = e.target.files[0];
      storeReferenceMainImage = firebase
        .storage()
        .ref(product_name.value + "/" + fileMainImage.name);
    });

    // read secondary images names, and create references to them in storage
    $('.secondary_image input[type="file"]').on("change", function (e) {
      secondaryImagesArray.push({
        file: e.target.files[0],
        storeReference: firebase
          .storage()
          .ref(product_name.value + "/" + e.target.files[0].name),
      });
      // prevent user from reselect new image
      // to keep secondaryImagesArray without unwanted images
      $(this).prop("disabled", true);
    });

    // get colors that has been selected
    $(".colors").on("change", function () {
      selectedColorsArray = $(".colors:checked")
        .map(function () {
          return this.value;
        })
        .get();
      console.log(selectedColorsArray);
    });

    // get sizes that has been selected
    $(".size").on("change", function () {
      selectedSizesArray = $(".size:checked")
        .map(function () {
          return this.value;
        })
        .get();
      console.log(selectedSizesArray);
    });

    ////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////

    // action of add product button to add product to DB
    $("#add_product_button").click(function () {
      // inputs validation
      if (
        product_name.value != "" &&
        product_price.value != "" &&
        $(".main_image #imgInp").val() != "" &&
        secondaryImagesArray.length > 0 &&
        selectedColorsArray.length > 0 &&
        selectedSizesArray.length > 0
      ) {
        // all data entered successfully
        swal("Upload new product!", "Please wait..");
        // upload main image to fB storage
        taskMainImage = storeReferenceMainImage.put(fileMainImage);
        taskMainImage
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((url) => {
            // get generated url to push it with all product data to database
            productKEY = firebase.database().ref().child("products").push({
              product_name: product_name.value,
              product_price: product_price.value,
              colors: selectedColorsArray,
              sizes: selectedSizesArray,
              main_image: url,
              sold_out: false,
            }).key;
          })
          .then(() => {
            // loop on all secondary images, and add them to FB storage
            // then get their urls and add them to the product data in database
            secondaryImagesArray.map((image) => {
              // upload image to FB storage
              let task = image.storeReference.put(image.file);
              task
                .then((snapshot) => snapshot.ref.getDownloadURL())
                .then((url) => {
                  // get generated url and add it to product data in database
                  secondaryImagesURLS.push(url);
                  console.log(secondaryImagesURLS);
                  firebase
                    .database()
                    .ref()
                    .child("products/" + productKEY + "/photos/")
                    .set({
                      images: secondaryImagesURLS,
                    });
                });
            });
          })
          .then(function () {
            swal("Good job!", "Product successfully added!", "success");
            setTimeout(() => {
              window.location.reload();
            }, 5000);
          })
          .catch((e) => {
            console.log("Something went wrong! refresh the page.", e);
          });
      } else {
        // Not all data were provided so display the modal warning
        swal(
          "Please fill all fields!",
          "Note: you must select main photo on left, and must select at least 1 photo from 5 rest photos!",
          "error"
        );
      }
    }); // end of $btn-post action
  })(); // end of self invoke function

  /////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Following code is to show demo of image in box, when user select one
   */

  $('input[type="file"]').on("change", function (e) {
    const _this = this;
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $(_this).siblings().attr("src", e.target.result);
        file = e.target.result;
      };
      reader.readAsDataURL(this.files[0]);
    }
  });
}); // end of document.ready()
