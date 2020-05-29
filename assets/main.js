$(function () {
  var client = ZAFClient.init();
  client.invoke("resize", { width: "100%", height: "800px" });
  client.get("ticket").then(function (data) {
    requestUserInfo(client, data);
  });

});

function requestUserInfo(client, data) {
  client.metadata().then(function (metadata) {
    let setting = metadata.settings;
    let url = `${setting.domain}/${setting.pattern}`
    var settings = {
      url: url,
      type: "POST",
      dataType: "json",
      data: {
        email: data.ticket.requester.email,
        subdomain: data.ticket.brand.subdomain,
        ticket: {
          id: data.ticket.id,
          createdAt: data.ticket.createdAt,
          omega_handshake: setting.omega_handshake,
          recipient: data.ticket.recipient,
          requester: data.ticket.requester
        },
      },
      cors: true,
    };

    client.request(settings).then(
      function (data) {
        showInfo(data);
      },
      function (response) {
        showError(response);
      }
    );
  });

}

function showInfo(data) {
  var requester_data = {
    email: data.email,
    orders: data.order,
    // order_number: data.order_number,
    // paid_date: formatDate(data.paid_date),
    // total_price: data.total_price,
    // purchase_items: data.purchase_items,
  };
  var source = $("#requester-template").html();
  var template = Handlebars.compile(source);
  var html = template(requester_data);
  $("#content").html(html);
}

function showError(response) {
  var error_data = {
    status: response.status,
    statusText: response.statusText,
  };
  var source = $("#error-template").html();
  var template = Handlebars.compile(source);
  var html = template(error_data);
  $("#content").html(html);
}

function formatDate(date) {
  var cdate = new Date(date);
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  date = cdate.toLocaleDateString("en-us", options);
  return date;
}
Handlebars.registerHelper("parseDate", function (date) {
  var cdate = new Date(date);
  var options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  date = cdate.toLocaleDateString("en-us", options);
  return date;
});
