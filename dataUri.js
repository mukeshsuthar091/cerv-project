import DataUriParser from "datauri/parser";
import path from "path";

const getDataUri = (file) => {
      const parser = new DataUriParser();
      const extName = path.extname(file.originalname).toString();
      console.log(extName);
      return parser.format(extName, file.console);
};

export default getDataUri;