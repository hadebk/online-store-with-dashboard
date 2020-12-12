$(document).ready(function () {
  (function () {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: "AIzaSyChTzQs0nMrFFNIZfacnapUARpGCP-Hb_w",
      authDomain: "hazzy-store.firebaseapp.com",
      databaseURL: "https://hazzy-store.firebaseio.com",
      projectId: "hazzy-store",
      storageBucket: "hazzy-store.appspot.com",
      messagingSenderId: "181223236649",
      appId: "1:181223236649:web:7e6163667295687e",
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    const db = firebase.database();

    var key_product;

    //************************** [START] Get New Values Form Modal Inputs To Update The Product ****************************//
    var arr_colors = [],
      arr_sizes = [];
    // get new values from inputs in modal
    var name_in_modal = document.getElementById("ads-name");
    var price_in_modal = document.getElementById("ads-price");

    // get new colors that has been selected
    $(".colors").on("change", function () {
      arr_colors = $(".colors:checked")
        .map(function () {
          return this.value;
        })
        .get();
      console.log(arr_colors);
    });

    // get new sizes that has been selected
    $(".size").on("change", function () {
      arr_sizes = $(".size:checked")
        .map(function () {
          return this.value;
        })
        .get();
      console.log(arr_sizes);
    });
    //************************** [END] Get New Values Form Modal Inputs To Update The Product ***************************//

    /**
     * DB query to fetch all products and display them
     */
    db.ref("products")
      .orderByKey()
      .on("value", function (snapshot) {
        if (snapshot.exists()) {
          var content = "";
          snapshot.forEach(function (data) {
            content = loadAllProducts(data);
          });
          // after load all products => append them to table
          $("#ads-table").append(content);

          /////////////////////////////////////////////////////////////////////////////////

          /**
           * Button 'Edit' in table, when click it, will see a modal with product data,
           * then you can make your changes.
           */

          editProductButton();

          ///////////////////////////////////////////////////////////////////////////////////

          /**
           * Button 'Delete' in table, when click it, the product will be deleted
           */
          deleteProductButton();

          ///////////////////////////////////////////////////////////////////////////////

          /**
           * Button 'Sold Out' in table, when click it, the product will be marked as 'Sold Out'
           */
          soldOutButton();

          ///////////////////////////////////////////////////////////////////////////////

          changeSoldOutButtonColor();

          ///////////////////////////////////////////////////////////////////////////////
        } else {
          console.log("There no product yet to be shown!");
          // empty the table again.
          var node = document.getElementById("ads-table");
          while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
          }
        }
      }); // end of show all products

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * load data (products) to table
     * @params [data]: snapshot from database, that have all products (response)
     */
    function loadAllProducts(data) {
      // clean the table first to add new values
      var node = document.getElementById("ads-table");
      while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
      }

      // destructuring data of the product
      const { product_name, product_price, main_image } = data.val();

      content += "<tr class=" + data.key + ">";
      content += '<td><img class="ads_image" src=' + main_image + "></td>";
      content += "<td>" + product_name + "</td>";
      content += "<td>" + product_price + "</td>";
      content +=
        '<td><button class="btn-showAdsToUpdate" data-toggle="modal" data-target="#centralModalLg"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>Edit</button></td>';
      content +=
        '<td><button class="btn-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>Delete</button></td>';
      content +=
        '<td><button class="btn-sold-out"><span class="glyphicon glyphicon-ban-circle" aria-hidden="true"></span>SOLD OUT</button></td>';
      content += "</tr>";
      content += "<hr>";

      return content;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * This function will fire , when click on 'Save Changes' button in Modal
     */
    function saveChangesButtonInModal() {
      // btn update action (in modal)
      function updateProduct(name, price, colors, sizes) {
        let postData = {
          product_name: name,
          product_price: price,
          colors: colors,
          sizes: sizes,
        };
        return firebase
          .database()
          .ref("products/")
          .child(key_product)
          .update(postData);
      } // end of update

      // action update button in modal
      const saveChangesButton = document.getElementById("btn-update");
      saveChangesButton.addEventListener("click", (e) => {
        let arr_colors = [];
        let arr_sizes = [];

        // Get data from inputs in Modal
        const name = name_in_modal.value;
        const price = price_in_modal.value;
        var selectedColors = document.querySelectorAll(".colors");
        // loop on all colors selector and get selected values
        for (var i = 0; i < selectedColors.length; i++) {
          if (selectedColors[i].checked == true) {
            arr_colors.push(selectedColors[i].getAttribute("value"));
          }
        }
        var selectedSizes = document.querySelectorAll(".size");
        // loop on all sizes selector and get selected values
        for (var i = 0; i < selectedSizes.length; i++) {
          if (selectedSizes[i].checked == true) {
            arr_sizes.push(selectedSizes[i].getAttribute("value"));
          }
        }
        // then update the product in DB
        updateProduct(name, price, arr_colors, arr_sizes);
        window.location.reload();
      }); //end of action update button in modal
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * This function will fire , when click on 'Edit' button in products table
     */
    function editProductButton() {
      var modal_product_name,
        modal_product_price,
        modal_product_colors = [],
        modal_product_sizes;

      $(".btn-showAdsToUpdate").click(function () {
        // clean all checked box of (colors) to receive new value
        var colorsSelector = document.querySelectorAll(".colors");
        colorsSelector.forEach((color) => {
          color.checked = false;
        });

        // clean all checked box of (size) to receive new value
        var sizesSelector = document.querySelectorAll(".size");
        sizesSelector.forEach((size) => {
          size.checked = false;
        });

        key_product = $(this).parents(":eq(1)").attr("class");

        // get product details from DB to show them in Modal
        firebase
          .database()
          .ref("products")
          .orderByKey()
          .equalTo(key_product)
          .once("value", function (snapshot) {
            if (snapshot.exists()) {
              // get product details from DB
              snapshot.forEach(function (data) {
                // save product details in vars, to display them in Modal
                modal_product_name = data.val().product_name;
                modal_product_price = data.val().product_price;
                modal_product_colors = data.val().colors;
                modal_product_sizes = data.val().sizes;
              });

              // set values to inputs in Modal

              name_in_modal.value = modal_product_name;
              price_in_modal.value = modal_product_price;

              /**
               * Make colors checkbox checked based on what the user selected before
               * LOGIC:
               * 1- loop on all selected color (already selected colors by Admin)
               * 2- compare each color of them with all available color in 'form-group'
               * 3- if there is a match, mark this matched color as selected
               */
              let colorsSelectorModal = document.querySelectorAll(".colors");
              for (let k = 0; k < modal_product_colors.length; k++) {
                for (let i = 0; i < colorsSelectorModal.length; i++) {
                  if (
                    colorsSelectorModal[i].getAttribute("value") ==
                    modal_product_colors[k]
                  ) {
                    colorsSelectorModal[i].checked = true;
                  }
                }
              }

              /**
               * Make sizes checkbox checked based on what the user selected before
               * LOGIC:
               * 1- loop on all selected size (already selected sizes by Admin)
               * 2- compare each size of them with all available size in 'form-group'
               * 3- if there is a match, mark this matched size as selected
               */
              let sizesSelectorModal = document.querySelectorAll(".size");
              for (let k = 0; k < modal_product_sizes.length; k++) {
                for (let i = 0; i < sizesSelectorModal.length; i++) {
                  if (
                    sizesSelectorModal[i].getAttribute("value") ==
                    modal_product_sizes[k]
                  ) {
                    sizesSelectorModal[i].checked = true;
                  }
                }
              }
              // update the product in DB
              saveChangesButtonInModal();
            } else {
              // snapshot not exist
              console.log("There is no product to update ):");
            }
          }); // end of on()
      }); // end of update button event
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * This function will fire , when click on 'Delete' button in products table
     */
    function deleteProductButton() {
      // delete product function
      let url_main_image, urls_secondaryImages;
      let storage = firebase.storage();
      $(".btn-delete").click(function () {
        // get product key
        var productKey = $(this).parents(":eq(1)").attr("class");
        // get urls of all product's images to delete them from FB storage
        firebase
          .database()
          .ref("products")
          .orderByKey()
          .equalTo(productKey)
          .on("value", function (snapshot) {
            if (snapshot.exists()) {
              // get urls
              snapshot.forEach(function (data) {
                url_main_image = data.val().main_image;
                urls_secondaryImages = data.val().photos.images;
              });

              // 1- Create a reference to the main image to delete it
              var desertRef = storage.refFromURL(url_main_image);
              // Delete the file
              desertRef
                .delete()
                .then(function () {
                  // File deleted successfully
                  console.log("Main image was deleted successfully!");
                })
                .catch(function (error) {
                  console.log(error);
                });

              // 2- Create a reference to the secondary of images to delete them
              for (var i = 0; i < urls_secondaryImages.length; i++) {
                var desertRef = storage.refFromURL(urls_secondaryImages[i]);
                // Delete the file
                desertRef
                  .delete()
                  .then(function () {
                    // File deleted successfully
                    console.log("Secondary image was deleted successfully!");
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              }

              // 3- then delete the product itself from realtime DB
              firebase
                .database()
                .ref("/products/" + productKey)
                .remove()
                .then(() => {
                  $.notify("Product was deleted successfully!", "success");
                });

              /**
               * TODO: prevent this case:
               * when delete a product, the table append the rest data agin to the table beside all old data (include deleted data)
               */
            } else {
              console.log("There is no product to be deleted ):");
            }
          });
      }); // end of delete button event
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * This function will fire , when click on 'Sold Out' button in products table.
     * Handel the events of Sold Out button, this button has 2 events:
     *         1- mark as sold out
     *         2- mark as not sold out back
     * Usage of Sold Out button: when click on it, the product will be marked as not available in store,
     * so the user can see the product but he can't make an order.
     */
    function soldOutButton() {
      // sold out button action
      $(".btn-sold-out").click(function () {
        var _this = this;
        // get product key
        var key_product = $(this).parents(":eq(1)").attr("class");

        // if true => product not marked as sold out, so make it sold out
        // if false => product already marked as sold out, so make it not sold out
        if ($(_this).css("background-color") == "rgb(153, 153, 153)") {
          // mark product as sold out
          firebase
            .database()
            .ref("products")
            .orderByKey()
            .equalTo(key_product)
            .on("value", function (snapshot) {
              if (snapshot.exists()) {
                var sold_out_new_value = {
                  sold_out: true,
                };
                firebase
                  .database()
                  .ref("products/")
                  .child(key_product)
                  .update(sold_out_new_value);
                // change the color of button
                $(_this).css({
                  "background-color": "#f8d7da",
                  color: "#721c24",
                });
                /**
                 * TODO: prevent this case:
                 * when click sold out button, the table append the data agin to the table beside all old data
                 */
                window.location.reload();
              } else {
                console.log("There is no product to be updated ):");
              }
            });
        } else if ($(_this).css("background-color") == "rgb(248, 215, 218)") {
          // mark product as not sold out
          firebase
            .database()
            .ref("products")
            .orderByKey()
            .equalTo(key_product)
            .on("value", function (snapshot) {
              if (snapshot.exists()) {
                var sold_out_new_value = {
                  sold_out: false,
                };
                firebase
                  .database()
                  .ref("products/")
                  .child(key_product)
                  .update(sold_out_new_value);
                // change the color of button
                $(_this).css({
                  "background-color": "#999",
                  color: "#555",
                });
                /**
                 * TODO: prevent this case:
                 * when click sold out button, the table append the data agin to the table beside all old data
                 */
                window.location.reload();
              } else {
                console.log("There is no product to be updated ):");
              }
            });
        }
      }); // end of done click event
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * After load all products, this function will loop on all of them,
     * and check if there is any products was marked as sold out, so this function
     * will change the color of sold out button of this products to red (mark it as sold out)
     */
    function changeSoldOutButtonColor() {
      // change the color of sold out button
      $(".btn-sold-out").each(function () {
        var _this_ = this;
        // get product key
        var key_product = $(this).parents(":eq(1)").attr("class");

        firebase
          .database()
          .ref("products")
          .orderByKey()
          .equalTo(key_product)
          .on("value", function (snapshot) {
            if (snapshot.exists()) {
              // loop on all products
              snapshot.forEach(function (data) {
                var sold_out = data.val().sold_out;
                if (sold_out == true) {
                  // if marked as sold out => change the button color to red
                  $(_this_).css({
                    "background-color": "#f8d7da",
                    color: "#721c24",
                  });
                }
              });
            } else {
              console.log("There is no product to show ):");
            }
          });
      }); // end of each()
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  })(); // end of self invoke function
}); // end of document.ready()
