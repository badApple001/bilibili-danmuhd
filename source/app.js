const webClient = require('./webClient');
const datapipe = require('./datapipe');

!function () {
    let client = new webClient("", 0);
    let pipe = new datapipe();
    client.dataPipe = pipe;
}();