import ConverterBox from "./ConverterBox";
import "../css/ConverterContainer.css";
import { Link } from "react-router-dom";

import { Converter_List } from "../utils/const";

const ConverterContainer = () => {
  return (
    <>
      <div className="ConverterContainer">
        {Converter_List.map((list, index) => (
          <Link to="/converterPage">
            {" "}
            <ConverterBox
              key={index}
              logo={list.logo}
              title={list.title}
              info={list.info}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default ConverterContainer;
