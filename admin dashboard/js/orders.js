$(document).ready(function () {
  (function () {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      // <PUT YOUR FIREBASE CONFIG HRER>
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // db query to fetch all orders to show them in table
    firebase
      .database()
      .ref("orders")
      .orderByKey()
      .on("value", function (snapshot) {
        if (snapshot.exists()) {
          var content = "";
          var counter = 1;
          snapshot.forEach((data) => {
            // clear the table to prevent the repeat of rows
            var node = document.getElementById("ads-table");
            while (node.hasChildNodes()) {
              node.removeChild(node.lastChild);
            }
            content = loadOrders(data, counter, content);
            counter++;
          });

          // after load all orders => append them to table
          $("#ads-table").append(content);

          // revers the 'tr' to show last added order first
          var tbody = $("#ads-table");
          tbody.html($("tr", tbody).get().reverse());

          // show total number of orders
          $(".total-num").html("(" + (counter - 1) + " orders)");

          ///////////////////////////////////////////////////////////////////////////////

          deleteOneOrder();

          ///////////////////////////////////////////////////////////////////////////////

          deleteAllOrders();

          ///////////////////////////////////////////////////////////////////////////////

          handelEventOfDoneButton();

          ///////////////////////////////////////////////////////////////////////////////

          changeDoneButtonColor();

          ///////////////////////////////////////////////////////////////////////////////
        } else {
          // snapshot not exist
          console.log("There is no orders yet!");
        }
      }); // end of db query

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * load data (orders) to table
     * @params [data]: snapshot from database, that have all orders (response)
     */
    function loadOrders(data, counter, content) {
      // destructuring data of the order
      const {
        product_image,
        product_name,
        color,
        size,
        quantity,
        name,
        phone,
        address,
        order_date,
      } = data.val();

      // build row to be added to order's table, where tha data will be shown
      content += "<tr class=" + data.key + ">";
      content += "<td>" + counter + "</td>";
      content += '<td><img class="pro_image" src=' + product_image + "></td>";
      content += "<td>" + product_name + "</td>";
      content += "<td>" + color + "</td>";
      content += "<td>" + size + "</td>";
      content += "<td>" + quantity + "</td>";
      content += "<td>" + name + "</td>";
      content += "<td>" + phone + "</td>";
      content += "<td>" + address + "</td>";
      content += "<td>" + order_date + "</td>";
      content +=
        '<td><button class="btn-delete"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span>Delete</button><button class="btn-done"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>Done</button></td>';
      content += "</tr>";
      return content;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Delete one order
     * Get id of order then execute the query to remove that order by it's id
     */
    function deleteOneOrder() {
      $(".btn-delete").click(function () {
        // get id of order, that was stored in parent's 'html class'
        var key_order = $(this).parents(":eq(1)").attr("class");
        // get url
        firebase
          .database()
          .ref("orders")
          .orderByKey()
          .equalTo(key_order)
          .on("value", function (snapshot) {
            if (snapshot.exists()) {
              firebase
                .database()
                .ref("/orders/" + key_order)
                .remove()
                .then(() => {
                  $.notify("Order deleted successfully", "success");
                });
            } else {
              console.log("There is no match with that order ):");
            }
          });
      }); // end of delete one order button event
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Delete all orders
     */
    function deleteAllOrders() {
      $("#btn-delete-all").click(function () {
        firebase
          .database()
          .ref("orders")
          .orderByKey()
          .on("value", function (snapshot) {
            if (snapshot.exists()) {
              firebase
                .database()
                .ref("/orders/")
                .remove()
                .then(() => {
                  // clear the table
                  var node = document.getElementById("ads-table");
                  while (node.hasChildNodes()) {
                    node.removeChild(node.lastChild);
                  }
                  // show total number of orders
                  $(".total-num").html("(0 orders)");
                  $.notify("All orders deleted successfully", "success");
                });
              //document.location.reload(true);
            } else {
              console.log("There are no orders to be deleted ):");
            }
          });
      }); // end of delete all button event
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Handel the events of Done button, this button has 2 events:
     *         1- mark as done
     *         2- mark as not done back
     * Usage of Done button: admin acn click it when he sent the order to the client (just as a flag says, this order sent).
     */

    function handelEventOfDoneButton() {
      // sold out button action
      $(".btn-done").click(function () {
        var _this = this;
        // get product key
        var key_product = $(_this).parents(":eq(1)").attr("class");
        $(_this).css("background-color") == "rgb(153, 153, 153)"
          ? markAsDone(_this, key_product) // activate 'Done' button
          : markAsNotDone(_this, key_product); // deactivate 'Don' button
      });
    }

    //order not marked as done, so make it done
    function markAsDone(element, key_product) {
      var updateDoneValue = {
        done: true,
      };
      firebase
        .database()
        .ref("orders/")
        .child(key_product)
        .update(updateDoneValue);
      // change the color of button
      $(element).css({
        "background-color": "#d4edda",
        color: "#155724",
      });
    }

    // order already marked as done, so make it not done
    function markAsNotDone(element, key_product) {
      var updateDoneValue_ = {
        done: false,
      };
      firebase
        .database()
        .ref("orders/")
        .child(key_product)
        .update(updateDoneValue_);
      // change the color of button
      $(element).css({
        "background-color": "#999",
        color: "#555",
      });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * After load all order, this function will loop on all of them,
     * and check if there is any order was marked as done, so this function
     * will change the color of done button of this order to green (mark it as done)
     */
    function changeDoneButtonColor() {
      $(".btn-done").each(function () {
        var _this = this;
        var key_order = $(this).parents(":eq(1)").attr("class");
        // get url
        firebase
          .database()
          .ref("orders")
          .orderByKey()
          .equalTo(key_order)
          .on("value", function (snapshot) {
            if (snapshot.exists()) {
              snapshot.forEach(function (data) {
                var done = data.val().done;
                if (done == true) {
                  $(_this).css({
                    "background-color": "#d4edda",
                    color: "#155724",
                  });
                }
              });
            } else {
              console.log("There is no order to update it's done status ):");
            }
          });
      }); // end of each()
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  })(); // end of self invoke function
}); // end of document.ready()
