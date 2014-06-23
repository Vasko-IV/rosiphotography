// if on OpenShift, use OpenShift ip/port, else use your local ip/port
var ipAddress = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_PORT || 3030;

   // The rest of the code
   :
   :


app.listen(port, ipAddress, function() {
  console.log('%s: Node server started on %s:%d ...',
                 new Date() ), ipAddress, port);
});