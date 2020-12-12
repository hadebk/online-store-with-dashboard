(function ($) {
  "use strict";
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyDMUOixvFatJdyfG59AHnSpA-QfWV-bvIY",
    authDomain: "hadi-online-store.firebaseapp.com",
    projectId: "hadi-online-store",
    storageBucket: "hadi-online-store.appspot.com",
    messagingSenderId: "561361601510",
    appId: "1:561361601510:web:faf660a66ff8fd92938c27",
    measurementId: "G-2CTRH4XP7W",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var db = firebase.database();

  // owl slider =======================================
  var owl = $(".owl-carousel");
  owl.owlCarousel({
    items: 4,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplayTimeout: 1200,
    autoplayHoverPause: true,
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
        nav: false,
        loop: true,
      },
      600: {
        items: 3,
        nav: false,
        loop: true,
      },
      1000: {
        items: 5,
        nav: false,
        loop: true,
      },
    },
  });

  $(".play").on("click", function () {
    owl.trigger("play.owl.autoplay", [1000]);
  });
  $(".stop").on("click", function () {
    owl.trigger("stop.owl.autoplay");
  });

  /*===================================================*/

  // smooth scroll to section when click on it in navbar
  $("#button-shopnow").click(function () {
    $("html,body").animate(
      {
        scrollTop: $("#product_section").offset().top,
      },
      1000
    );
  });

  /*===============================================================
      [ display all product ]*/
  db.ref("products")
    .orderByKey()
    .on("value", function (snapshot) {
      if (snapshot.exists()) {
        let content = "";

        // clean product box first
        var list = document.getElementById("products-box");
        while (list.hasChildNodes()) {
          list.removeChild(list.firstChild);
        }

        snapshot.forEach(function (data) {
          // get data
          var main_image = data.val().main_image;
          var product_name = data.val().product_name;
          var product_price = data.val().product_price;
          var sold_out = data.val().sold_out;

          content +=
            '<div class="col-sm-6 col-md-4 col-lg-3 p-b-30" id=' +
            data.key +
            ">";
          content += '<div class="block2">';
          content += '<div class="block2-pic hov-img0">';
          content += '<img src="' + main_image + '"alt="IMG-PRODUCT">';
          if (sold_out == true) {
            content +=
              '<img src="images/sold-out-png-19955.png"alt="IMG-PRODUCT" style="position: absolute;bottom: 0;left: 0">';
          }
          content +=
            '<a href="#" class="block2-btn flex-c-m stext-103 size-102 bg0 bor2 p-lr-15 trans-04 js-show-modal1 quick-view-button">';
          content += "Quick View";
          content += "</a>";
          content += "</div>"; // end of hov-img0
          content += '<div class="block2-txt flex-w flex-t p-t-14">';
          content += '<div class="block2-txt-child1 flex-col-l ">';
          content += '<span class="stext-104 trans-04 js-name-b2 p-b-6">';
          content += product_name + "</span>";
          content +=
            '<span class="stext-105">' + "$" + product_price + "</span>";
          content += "</div>"; // end of block2-txt-child1
          content += "</div>"; // end of block2-txt
          content += "</div>"; // end of block2
          content += "</div>"; // end of main-box
        });
        $(".products-box").append(content);
        // start-: revers the divs to show last added product first
        $.fn.reverseChildren = function () {
          return this.each(function () {
            var $this = $(this);
            $this.children().each(function () {
              $this.prepend(this);
            });
          });
        };
        $(".products-box").reverseChildren();
        // end-: revers the divs to show last added product first
        show_modal();
        show_data_modal();
      } else {
        console.log("no data yet!");
      }
    }); // end of on() "db query"

  /*===========================================================
      [ Load page ]*/
  $(".animsition").animsition({
    inClass: "fade-in",
    outClass: "fade-out",
    inDuration: 1500,
    outDuration: 800,
    linkElement: ".animsition-link",
    loading: true,
    loadingParentElement: "html",
    loadingClass: "animsition-loading-1",
    loadingInner: '<div class="loader05"></div>',
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ["animation-duration", "-webkit-animation-duration"],
    overlay: false,
    overlayClass: "animsition-overlay-slide",
    overlayParentElement: "html",
    transition: function (url) {
      window.location.href = url;
    },
  });

  /*===========================================================
      [ Back to top ]*/
  var windowH = $(window).height() / 2;

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > windowH) {
      $("#myBtn").css("display", "flex");
    } else {
      $("#myBtn").css("display", "none");
    }
  });

  $("#myBtn").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      300
    );
  });

  /*==================================================================
      [ +/- num product ]*/
  $(".btn-num-product-down").on("click", function () {
    var numProduct = Number($(this).next().val());
    if (numProduct > 0)
      $(this)
        .next()
        .val(numProduct - 1);
    var x = Number($(this).next().val());
    console.log("val: " + x);
  });

  $(".btn-num-product-up").on("click", function () {
    var numProduct = Number($(this).prev().val());
    $(this)
      .prev()
      .val(numProduct + 1);
    var x = Number($(this).prev().val());
    console.log("val: " + x);
  });

  /*==================================================================
      [ Show modal1 ]*/
  function show_modal() {
    $(".js-show-modal1").on("click", function (e) {
      e.preventDefault();
      $(".js-modal1").addClass("show-modal1");
    });

    $(".js-hide-modal1").on("click", function () {
      $(".js-modal1").removeClass("show-modal1");
    });
  }
  /*==================================================================
      [ Show data in the modal1 ]*/
  var pro_price;

  function show_data_modal() {
    $(".js-show-modal1").click(function () {
      // clean some inputs value and border
      $("#size-select").parent().css("border", "none");
      $("#quantity").val("0");
      $("#quantity").parent().css("border", "none");
      v_color = true;
      v_quantity = true;
      v_size = true;

      // clean img box
      var chil = document.getElementById("wrap-slick3");
      while (chil.hasChildNodes()) {
        chil.removeChild(chil.lastChild);
      }

      // clean size select options
      var chil = document.getElementById("size-select");
      while (chil.hasChildNodes()) {
        chil.removeChild(chil.lastChild);
      }

      // clean color radio options
      var chil = document.getElementById("colors-radio");
      while (chil.hasChildNodes()) {
        chil.removeChild(chil.lastChild);
      }

      // get key of product in db
      var key_of_product = $(this).parents(":eq(2)").attr("id");

      // init vars
      let main_image, pro_name, sold_out_flag;
      let images_arr = [],
        colors_arr = [],
        sizes_arr = [];

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

              // unbind order button when the product sold out
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
              }

              // set data to modal
              $(".title").html(pro_name);
              $(".price").html("$" + pro_price);

              // color select, add chooses
              let color_option = "";
              for (var i = 0; i < colors_arr.length; i++) {
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
                color_option = "";
              }

              // size select, add option
              let size_option = "<option>Choose an option</option>";
              for (var i = 0; i < sizes_arr.length; i++) {
                size_option += "<option>" + sizes_arr[i] + "</option>";
              }
              $("#size-select").append(size_option);
              size_option = "";

              // add images to modal (dynamicly)
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

              // add the rest of image based on the number of image was added
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

              // init slick slider
              ini_slick();
            }); // snapshot.foreach()

            console.log("done!");

            // color input validation
            $("input[name=color]").click(function () {
              console.log($("input[name=color]:checked").val());
              if ($("input[name=color]:checked").length == 0) {
                v_color = true;
                $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
              } else {
                v_color = false;
                $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
              }
            });
          } else {
            // snapshot not exist
            console.log("no data");
          }
        }); // end of db query
    }); // end on click event
  } // end of show_data_modal()

  /*============================================================================
      [ Make an oredr, send data to db, inputs validation]*/
  // get inputs values
  const size = document.getElementById("size-select");
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  const address = document.getElementById("address");

  // flag for validation
  var v_color = true;
  var v_quantity = true;
  var v_size = true;
  var v_name = true;
  var v_phone = true;
  var v_address = true;

  //***** validation inputs *****//

  // 1) quantity input
  $("#quantity").on("change", function () {
    console.log($(this).val() + "--out");
    if ($(this).val() <= 0) {
      v_quantity = true;
      $(this).parent().css("border", "2px solid #f00");
      $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
    } else {
      v_quantity = false;
      $(this).parent().css("border", "2px solid #080");
      $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
    }
  });
  $(".btn-num-product-down").on("click", function () {
    if ($("#quantity").val() <= 0) {
      v_quantity = true;
      $("#quantity").parent().css("border", "2px solid #f00");
      $("#quantity").parents(":eq(2)").find(".custom-alert").fadeIn(200);
    } else {
      v_quantity = false;
      $("#quantity").parent().css("border", "2px solid #080");
      $("#quantity").parents(":eq(2)").find(".custom-alert").fadeOut(200);
    }
  });
  $(".btn-num-product-up").on("click", function () {
    if ($("#quantity").val() <= 0) {
      v_quantity = true;
      $("#quantity").parent().css("border", "2px solid #f00");
      $("#quantity").parents(":eq(2)").find(".custom-alert").fadeIn(200);
    } else {
      v_quantity = false;
      $("#quantity").parent().css("border", "2px solid #080");
      $("#quantity").parents(":eq(2)").find(".custom-alert").fadeOut(200);
    }
  });

  // 2) size input
  $("#size-select").change(function () {
    if ($(this).val() == "Choose an option" || $(this).val() == "") {
      console.log($(this).val() + "/bad");
      v_size = true;
      $(this).parent().css("border", "2px solid #f00");
      $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
    } else {
      console.log($(this).val() + "/good");
      v_size = false;
      $(this).parent().css("border", "2px solid #080");
      $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
    }
  });

  // 3) name input
  $("#name").blur(function () {
    if ($(this).val().length == 0) {
      v_name = true;
      $(this).parent().css("border", "2px solid #f00");
      $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
    } else {
      v_name = false;
      $(this).parent().css("border", "2px solid #080");
      $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
    }
  });

  // 4) phone input
  $("#phone").blur(function () {
    if (!/^(01)[0-9]{9}$/.test($(this).val())) {
      v_phone = true;
      $(this).parent().css("border", "2px solid #f00");
      $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
    } else {
      v_phone = false;
      $(this).parent().css("border", "2px solid #080");
      $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
    }
  });

  // 5) address input
  $("#address").blur(function () {
    if ($(this).val().length == 0) {
      v_address = true;
      $(this).parent().css("border", "2px solid #f00");
      $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
    } else {
      v_address = false;
      $(this).parent().css("border", "2px solid #080");
      $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
    }
  });

  /*============================================================================
      [ Make an oredr, send data to db]*/

  $(".button-order").click(function () {
    if (
      !v_color &&
      !v_quantity &&
      !v_size &&
      !v_name &&
      !v_phone &&
      !v_address
    ) {
      // validation success
      Swal.fire("Sending your order!", "Please wait..!", "info");

      // deactive order button until order send successfully
      var x0 = document.getElementById("button-order");
      x0.disabled = true;
      $("#button-order").css("opacity", ".5");
      $("#button-order").css("cursor", "not-allowed");

      // Get ELements
      var color_input = $("input[name=color]:checked").val();
      var quantity_input = $("#quantity").val();
      var size_input = $("#size-select").val();
      var name_input = $("#name").val();
      var phone_input = $("#phone").val();
      var address_input = $("#address").val();
      var product_name = $(".title").html();
      var product_image = $(".slick3 .item-slick3 img").attr("src");
      var today = new Date();
      var date =
        today.getFullYear() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getDate();
      var min = today.getMinutes();
      var hour = today.getHours();
      if (min < 10) {
        min = "0" + today.getMinutes();
      } else {
        min = today.getMinutes();
      }
      if (hour < 10) {
        hour = "0" + today.getHours();
      } else {
        hour = today.getHours();
      }
      var time = hour + ":" + min;
      var postDate = time + " " + date;

      let key1 = firebase
        .database()
        .ref()
        .child("orders")
        .push(
          {
            color: color_input,
            quantity: quantity_input,
            size: size_input,
            name: name_input,
            phone: phone_input,
            address: address_input,
            order_date: postDate,
            product_image: product_image,
            product_name: product_name,
            done: false,
          },
          function (error) {
            if (error) {
              // The write failed...
              swal("Make an order agine please..", "error");
            } else {
              // Data saved successfully!
              Swal.fire({
                title: "Your order has been submited",
                type: "success",
                html:
                  '<hr><h5 style="text-align: left;margin-top:10px"><b>Order Details:</b></h5><br>' +
                  '<p style="text-align: left">Color: ' +
                  color_input +
                  "</p><br>" +
                  '<p style="text-align: left">Size: ' +
                  size_input +
                  "</p><br>" +
                  '<p style="text-align: left">Quantity: ' +
                  quantity_input +
                  " piece</p><br>" +
                  '<p style="text-align: left" style="text-align: left">Price: $' +
                  Number(quantity_input) * Number(pro_price) +
                  "</p><br>" +
                  '<p style="text-align: left">Shipping charges: $40</p><hr>' +
                  "<h5><b>Total: $" +
                  (Number(quantity_input) * Number(pro_price) + 40) +
                  "</b></h5><hr>" +
                  "<p>*Your order will arrive you within (3 Days - 1 Week).</p><br>" +
                  "<p>*In case of any problem in the product, email us.</p>",
                showCloseButton: true,
                focusConfirm: false,
              });
              // active order button after order send successfully
              var x1 = document.getElementById("button-order");
              x1.disabled = false;
              $("#button-order").css("opacity", "1");
              $("#button-order").css("cursor", "pointer");
              key1 = "";
            }
          }
        ).key;
    } else {
      // alert to empty input
      console.log("errrrror");
      if (v_color) {
        $("#colors-radio").parent().find(".custom-alert").fadeIn(200);
      }
      if (v_quantity) {
        $("#quantity").parent().css("border", "2px solid #f00");
        $("#quantity").parents(":eq(2)").find(".custom-alert").fadeIn(200);
      }
      if (v_size) {
        $("#size-select").parent().css("border", "2px solid #f00");
        $("#size-select").parents(":eq(2)").find(".custom-alert").fadeIn(200);
      }
      if (v_name) {
        $("#name").parent().css("border", "2px solid #f00");
        $("#name").parents(":eq(2)").find(".custom-alert").fadeIn(200);
      }
      if (v_phone) {
        $("#phone").parent().css("border", "2px solid #f00");
        $("#phone").parents(":eq(2)").find(".custom-alert").fadeIn(200);
      }
      if (v_address) {
        $("#address").parent().css("border", "2px solid #f00");
        $("#address").parents(":eq(2)").find(".custom-alert").fadeIn(200);
      }
    } // end of else
  }); // end of order button event

  /*============================================================================
      [ init slock and popup image display]*/
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
})(jQuery);
