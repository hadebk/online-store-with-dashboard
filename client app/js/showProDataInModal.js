/*
    [ set product data in the Modal ]

    The purpose of this function:
        - first clear the modal of any data
        - then add product's data to tha modal
        - so this function will be invoked each time the user open new product

    NOTE: this function should be 'Promise' function, 
    because first of all we should wait until html inputs loaded to modal (append html code to page),
    then we can add events to those element (validation's events).
*/

export const showProDataInModal = () => {
  return new Promise((resolve, reject) => {
    $(".js-show-modal1").click(function () {
      // clean some inputs value and border (ex: red border)
      $("#size-select").parent().css("border", "none");
      $("#quantity").val("0");
      $("#quantity").parent().css("border", "none");

      // clean images box
      var chilled = document.getElementById("wrap-slick3");
      while (chilled.hasChildNodes()) {
        chilled.removeChild(chilled.lastChild);
      }

      // clean size select options
      var chilled = document.getElementById("size-select");
      while (chilled.hasChildNodes()) {
        chilled.removeChild(chilled.lastChild);
      }

      // clean color radio options
      var chilled = document.getElementById("colors-radio");
      while (chilled.hasChildNodes()) {
        chilled.removeChild(chilled.lastChild);
      }

      /**
       * After clean Modal from previous product' data,
       * get the data of new product and show them in Modal
       */

      // get key of product in db
      var key_of_product = $(this).parents(":eq(2)").attr("id");

      // init vars
      let main_image,
        pro_price,
        pro_name,
        sold_out_flag,
        colors_arr,
        sizes_arr,
        images_arr;

      // db query
      firebase
        .database()
        .ref("products")
        .orderByKey()
        .equalTo(key_of_product)
        .on("value", function (snapshot) {
          if (snapshot.exists()) {
            snapshot.forEach(function (data) {
              // get data
              main_image = data.val().main_image;
              pro_name = data.val().product_name;
              pro_price = data.val().product_price;
              colors_arr = data.val().colors;
              sizes_arr = data.val().sizes;
              images_arr = data.val().photos.images;
              sold_out_flag = data.val().sold_out;

              // disable order button when the product sold out (not available)
              if (sold_out_flag == true) {
                var x = document.getElementById("button-order");
                x.disabled = true;
                $("#button-order").css("opacity", ".5");
                $("#button-order").css("cursor", "not-allowed");
              } else if (sold_out_flag == false) {
                var x = document.getElementById("button-order");
                x.disabled = false;
                $("#button-order").css("opacity", "1");
                $("#button-order").css("cursor", "pointer");
              } /////////////////////////////////////////////////////////////////

              // set product's data to Modal //

              $(".title").html(pro_name);
              $(".price").html("$" + pro_price);

              // product colors, loop on all colors of the product and display them
              for (var i = 0; i < colors_arr.length; i++) {
                let color_option = "";
                color_option +=
                  '<div><input type="radio" id="color-' +
                  i +
                  '" name="color" value="' +
                  colors_arr[i] +
                  '">';
                color_option += ' <label for="color-' + i + '">';
                color_option += ' <span id="color-bk' + i + '">';
                color_option += ' <i class="fa fa-check"></i>';
                color_option += " </span>";
                color_option += " </label>";
                color_option += "</div>";

                $("#colors-radio").append(color_option);

                // css bg color
                $("#color-bk" + i).css("background-color", colors_arr[i]);
              } ////////////////////////////////////////////////////////////////////

              // product sizes,  loop on all sizes of the product and display them
              let size_option = "<option>Choose an option</option>";
              for (var i = 0; i < sizes_arr.length; i++) {
                size_option += "<option>" + sizes_arr[i] + "</option>";
              }
              $("#size-select").append(size_option);
              size_option = "";
              /////////////////////////////////////////////////////////////////////

              // add product's main image to Modal (dynamic)
              let content = "";

              var div_1 =
                '<div class="wrap-slick3-dots" id="wrap-slick3-dots"></div>';
              $("#wrap-slick3").append(div_1);

              var div_2 =
                '<div class="wrap-slick3-arrows flex-sb-m flex-w" id="wrap-slick3-arrows"></div>';
              $("#wrap-slick3").append(div_2);

              // add main image first
              content +=
                '<div class="slick3 gallery-lb left-side-images" id="box__images">';
              content +=
                '<div class="item-slick3" data-thumb="' + main_image + '">';
              content += '<div class="wrap-pic-w pos-relative">';
              content += '<img src="' + main_image + '" alt="IMG-PRODUCT">';
              content +=
                '<a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 trans-04" href="' +
                main_image +
                '">';
              content += '<i class="fa fa-expand"></i>';
              content += "</a>";
              content += " </div>";
              content += "</div>";
              content += "</div>";

              $("#wrap-slick3").append(content);
              content = "";
              ///////////////////////////////////////////////////////////////////////////////////////

              // add the rest of product's images based on the number of image was added (dynamic)
              for (var i = 0; i < images_arr.length; i++) {
                content +=
                  '<div class="item-slick3" data-thumb="' +
                  images_arr[i] +
                  '">';
                content += '<div class="wrap-pic-w pos-relative">';
                content +=
                  '<img src="' + images_arr[i] + '" alt="IMG-PRODUCT">';
                content +=
                  '<a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 trans-04" href="' +
                  images_arr[i] +
                  '">';
                content += '<i class="fa fa-expand"></i>';
                content += "</a>";
                content += " </div>";
                content += "</div>";
              }
              $("#box__images").append(content);
              ///////////////////////////////////////////////////////////////////////////////////////

              // after add all product data to Modal => init slick slider
              ini_slick();
            }); // snapshot.foreach()
            resolve(pro_price);
          } else {
            // snapshot not exist
            console.log("There is no product to be shown ):");
            reject("There is no product to be shown ):");
          }
        }); // end of db query
    }); // end on click event
  });
};

/*============================================================================
      [ init slick and popup image display]*/
function ini_slick() {
  $(".wrap-slick3").each(function () {
    $(this)
      .find(".slick3")
      .slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        infinite: true,
        autoplay: false,
        autoplaySpeed: 6000,
        arrows: true,
        appendArrows: $(this).find(".wrap-slick3-arrows"),
        prevArrow:
          '<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
        nextArrow:
          '<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
        dots: true,
        appendDots: $(this).find(".wrap-slick3-dots"),
        dotsClass: "slick3-dots",
        customPaging: function (slick, index) {
          var portrait = $(slick.$slides[index]).data("thumb");
          return (
            '<img src=" ' +
            portrait +
            ' "/><div class="slick3-dot-overlay"></div>'
          );
        },
      });
  });

  // init magnifier pop up
  $(".gallery-lb").each(function () {
    // the containers for all your galleries
    $(this).magnificPopup({
      delegate: "a", // the selector for gallery item
      type: "image",
      gallery: {
        enabled: true,
      },
      mainClass: "mfp-fade",
    });
  });
}
