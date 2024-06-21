import dotenv from "dotenv";

export default function instrument() {
  dotenv.config({
    path: `${process.env.JS_BINARY__EXECROOT}/${process.env.ENV}`,
  });
}
