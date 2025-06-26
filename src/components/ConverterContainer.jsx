import ConverterBox from "./ConverterBox";
import "../css/ConverterContainer.css";
import { Link } from "react-router-dom";
import { Converter_List } from "../utils/const";

const ConverterContainer = () => {
  return (
    <>
      <div className="ConverterContainer">
        {Converter_List.map((list, index) => (
          <Link
            key={index}
            to={`/converterPage?type=${encodeURIComponent(
              list.title
            )}&target=${encodeURIComponent(
              list.targetFormat
            )}&source=${encodeURIComponent(
              list.sourceFormat
            )}&endpoint=${encodeURIComponent(list.endpoint)}&index=${index}${
              list.acceptedFormats
                ? `&accepted=${encodeURIComponent(
                    list.acceptedFormats.join(",")
                  )}`
                : ""
            }`}
          >
            <ConverterBox
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
