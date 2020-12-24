import { makeAnOrder } from "./makeAnOrder.js";
import { showProDataInModal } from "./showProDataInModal.js";
(function ($) {
  "use strict";
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    // <PUT YOUR FIREBASE CONFIGRATIONS HERE>
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var db = firebase.database();

  var pro_price;

  /*============================================================================
      [ inputs validation ]*/

  // flag for validation
  var v_color = true;
  var v_quantity = true;
  var v_size = true;
  var v_name = true;
  var v_phone = true;
  var v_address = true;

  /*===============================================================
      [ display all product in page ]*/
  db.ref("products")
    .orderByKey()
    .on("value", function (snapshot) {
      if (snapshot.exists()) {
        let content = "";

        // First of all => clean products wrapper.
        var list = document.getElementById("products-box");
        while (list.hasChildNodes()) {
          list.removeChild(list.firstChild);
        } //////////////////////////////////////////////////

        snapshot.forEach(function (data) {
          // get product's data
          const {
            main_image,
            product_name,
            product_price,
            sold_out,
          } = data.val();

          content +=
            '<div class="col-sm-6 col-md-4 col-lg-3 p-b-30" id=' +
            data.key +
            ">";
          content += '<div class="block2">';
          content += '<div class="block2-pic hov-img0">';
          content += '<img src="' + main_image + '"alt="IMG-PRODUCT">';
          sold_out == true
            ? (content +=
                '<img src="images/sold-out-png-19955.png"alt="IMG-PRODUCT" style="position: absolute;bottom: 0;left: 0">')
            : "";
          content +=
            '<a href="#" class="block2-btn flex-c-m stext-103 size-102 bg0 bor2 p-lr-15 trans-04 js-show-modal1 quick-view-button">';
          content += "Quick View";
          content += "</a>";
          content += "</div>"; // end of hov-img0
          content += '<div class="block2-txt flex-w flex-t p-t-14">';
          content += '<div class="block2-txt-child1 flex-col-l ">';
          content += '<span style="color: #b2b2b2;" class="stext-104 trans-04 js-name-b2 p-b-6">';
          content += product_name + "</span>";
          content +=
            '<span class="stext-105">' + "$" + product_price + "</span>";
          content += "</div>"; // end of block2-txt-child1
          content += "</div>"; // end of block2-txt
          content += "</div>"; // end of block2
          content += "</div>"; // end of main-box
        });
        // after load all product => display them them to page
        $(".products-box").append(content);
        // start-: revers the products to show last added product first
        $.fn.reverseChildren = function () {
          return this.each(function () {
            var $this = $(this);
            $this.children().each(function () {
              $this.prepend(this);
            });
          });
        };
        $(".products-box").reverseChildren();
        // end-: revers the products to show last added product first
        show_modal();
        // [ display product data in the Modal ]
        showProDataInModal()
          .then((productPrice) => {
            // 1- inputs and data were loaded successfully to Modal
            console.log(
              "Product details were added successfully!",
              productPrice
            );
            pro_price = productPrice;
          })
          .then(() => {
            // 2- after load the inputs & data to Modal => add validation events to those inputs.
            console.log("Inputs validations were added successfully!");
            orderInputsValidation();
          })
          .catch((e) => {
            console.log("Error in display product data in Modal ):", e);
          });
      } else {
        console.log("There is no products to display!");
      }
    }); // end of on() "db query"

  //***** validation inputs *****//
  function orderInputsValidation() {
    // 0) color input validation
    $("input[type=radio][name=color]").click(function () {
      console.log($("input[type=radio][name=color]:checked").val());
      if ($("input[type=radio][name=color]:checked").length == 0) {
        v_color = true;
        $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
      } else {
        v_color = false;
        $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
      }
    });

    // 1) quantity input validation
    $("#quantity").on("change", function () {
      if ($(this).val() <= 0) {
        v_quantity = true;
        console.log("quantity", v_quantity);
        $(this).parent().css("border", "2px solid #f00");
        $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
      } else {
        v_quantity = false;
        console.log("quantity", v_quantity);
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
      if ($("#quantity").val() < 0) {
        v_quantity = true;
        $("#quantity").parent().css("border", "2px solid #f00");
        $("#quantity").parents(":eq(2)").find(".custom-alert").fadeIn(200);
      } else {
        v_quantity = false;
        $("#quantity").parent().css("border", "2px solid #080");
        $("#quantity").parents(":eq(2)").find(".custom-alert").fadeOut(200);
      }
    });

    // 2) size input validation
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

    // 3) name input validation
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

    // 4) phone input validation
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

    // 5) address input validation
    $("#address").blur(function () {
      if ($(this).val().trim().length == 0) {
        v_address = true;
        $(this).parent().css("border", "2px solid #f00");
        $(this).parents(":eq(2)").find(".custom-alert").fadeIn(200);
      } else {
        v_address = false;
        $(this).parent().css("border", "2px solid #080");
        $(this).parents(":eq(2)").find(".custom-alert").fadeOut(200);
      }
    });
  }

  /*============================================================================
      [ Make an order, send data to db]*/

  $(".button-order").click(function () {
    makeAnOrder(
      pro_price,
      v_color,
      v_quantity,
      v_size,
      v_name,
      v_phone,
      v_address
    );
  }); // end of order button event

  /*==================================================================
          [ Show product details Modal ]*/
  function show_modal() {
    $(".js-show-modal1").on("click", function (e) {
      e.preventDefault();
      // show 'Quick view' Modal
      $(".js-modal1").addClass("show-modal1");
      /**
       * every time show 'Quick view' Modal:
       *    1- reset validation flag of inputs (color, quantity, size), because they have no value.
       *    2- reinvoke showProDataInModal() function to load the details of new clicked product.
       */
      // 1- validation flag reset
      v_color = true;
      v_quantity = true;
      v_size = true;
      // 2- load the details of new clicked product
      showProDataInModal()
        .then((productPrice) => {
          // 1- inputs and data were loaded successfully to Modal
          console.log("Product details were added successfully!", productPrice);
          pro_price = productPrice;
        })
        .then(() => {
          // 2- after load the inputs & data to Modal => add validation events to those inputs.
          console.log("Inputs validations were added successfully!");
          orderInputsValidation();
        })
        .catch((e) => {
          console.log("promise error: ", e);
        });
    });

    $(".js-hide-modal1").on("click", function () {
      $(".js-modal1").removeClass("show-modal1");
    });
  }

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

  // smooth scroll to section when click on 'shop now'
  $("#button-shopnow").click(function () {
    $("html,body").animate(
      {
        scrollTop: $("#product_section").offset().top,
      },
      1000
    );
  });

  /*===========================================================
        [ Apply animation when Load page ]*/
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
            [ action of back to top button ]*/
  var windowH = $(window).height() / 2;

  $(window).on("scroll", function () {
    if ($(this).scrollTop() > windowH) {
      $("#goToTopButton").css("display", "flex");
    } else {
      $("#goToTopButton").css("display", "none");
    }
  });

  $("#goToTopButton").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      300
    );
  });

  /*==================================================================
            [ action of +/- quantity in Modal (when make an order) ]*/
  $(".btn-num-product-down").on("click", function () {
    var numProduct = Number($(this).next().val());
    if (numProduct > 0) {
      $(this)
        .next()
        .val(numProduct - 1);
      var x = Number($(this).next().val());
      console.log("val: " + x);
    }
  });

  $(".btn-num-product-up").on("click", function () {
    var numProduct = Number($(this).prev().val());
    $(this)
      .prev()
      .val(numProduct + 1);
    var x = Number($(this).prev().val());
    console.log("val: " + x);
  });
})(jQuery);
