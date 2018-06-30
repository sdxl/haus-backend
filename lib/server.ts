import app from "./app";
import * as config from "./config";

const port = config.env.app.port;
app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});