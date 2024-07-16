exports.sqlErrors = (err, request, response, next) => {
   const errorCodes = ["22P02"];
   if (errorCodes.includes(err.code)) {
      response.status(400).send({ msg: "Bad request" });
   }
   next(err);
};

exports.customErrors = (err, request, response, next) => {
   if (err.status && err.msg) {
      response.status(err.status).send({ msg: err.msg });
   }
   next(err);
};

exports.serverErrors = (err, request, response, next) => {
   response.status(500).send({ msg: "Internal server error" });
};
