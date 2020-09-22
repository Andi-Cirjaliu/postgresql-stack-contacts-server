const prometheusClient = require("prom-client");

const register = prometheusClient.register;

// const counterRequestsTotal = new prometheusClient.Counter({
//   name: "contacts_requests_total",
//   help: "Total number of requests",
// });

// const counterRequestsNotFound = new prometheusClient.Counter({
//   name: "contacts_requests_page_not_found",
//   help: "Total number of requests",
// });

const counterRequests = new prometheusClient.Counter({
  name: "contacts_requests",
  help: "Test requests",
  labelNames: ["counter_type"],
});

const counterAddSucceded = new prometheusClient.Counter({
  name: "contacts_add_succeeded",
  help: "Requests to add contact that succeeded",
});

const counterAddFailed = new prometheusClient.Counter({
  name: "contacts_add_failed",
  help: "Requests to add contact that failed",
});

const gaugeTotalContacts = new prometheusClient.Gauge({
  name: "contacts_total",
  help: "Number of contacts",
});

// const histogram1 = new prometheusClient.Histogram({
//     name: "contacts_histogram1",
//     help: "Test histogram"
// });

// histogram1.observe(10);
// histogram1.observe(20);
// histogram1.observe(4);

module.exports = {
  register,
//   counterRequestsTotal,
//   counterRequestsNotFound,
  counterRequests,
  counterAddSucceded,
  counterAddFailed,
  gaugeTotalContacts,
};
