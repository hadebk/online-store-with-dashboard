export function makeAnOrder(
  pro_price,
  v_color,
  v_quantity,
  v_size,
  v_name,
  v_phone,
  v_address
) {
  if (!v_color && !v_quantity && !v_size && !v_name && !v_phone && !v_address) {
    // validation success
    Swal.fire("Sending your order!", "Please wait..!", "info");

    // deactivate 'make an order' button until order send successfully
    var button_order = document.getElementById("button-order");
    button_order.disabled = true;
    $("#button-order").css("opacity", ".5");
    $("#button-order").css("cursor", "not-allowed");
    /////////////////////////////////////////////////////////////////

    // Get ELements from inputs in Modal (order data)
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

    // got all order data (:

    //////////////////////////////////////////////////////////////////////
    // after get all order data => make an order and add this order to database
    firebase
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
            swal("Something went wrong! please make your order agin.", "error");
          } else {
            // order saved successfully!, show Modal for order details to user
            Swal.fire({
              title: "Your order was sent successfully.",
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
                '<p style="text-align: left">Shipping charges: $5</p><hr>' +
                "<h4><b>Total: $" +
                (Number(quantity_input) * Number(pro_price) + 5) +
                "</b></h4><hr>" +
                "<p style='text-align: left; font-size: 12px;'>*Your order will arrive you within 2 Days.</p><br>" +
                "<p style='text-align: left; font-size: 12px;'>*In case of any problem in the product, get in touch.</p>",
              showCloseButton: true,
              focusConfirm: false,
            });
            // active order button after order send successfully
            var button_order = document.getElementById("button-order");
            button_order.disabled = false;
            $("#button-order").css("opacity", "1");
            $("#button-order").css("cursor", "pointer");
            ////////////////////////////////////////////////////
            // reset flags for validation
            
          }
        }
      );
  } else {
    // Error! there are some inputs with no values => don't send the order and display error message to user
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
}
