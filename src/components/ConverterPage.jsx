import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import "../css/ConverterPage.css";

const ConverterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [converterInfo, setConverterInfo] = useState({
    type: "",
    targetFormat: "",
    sourceFormat: "",
    endpoint: "",
    acceptedFormats: [],
    index: null,
  });

  useEffect(() => {
    const type = searchParams.get("type");
    const targetFormat = searchParams.get("target");
    const sourceFormat = searchParams.get("source");
    const endpoint = searchParams.get("endpoint");
    const acceptedFormatsStr = searchParams.get("accepted");
    const index = searchParams.get("index");

    if (!type || !targetFormat || !endpoint) {
      navigate("/");
      return;
    }

    setConverterInfo({
      type,
      targetFormat,
      sourceFormat: sourceFormat || "",
      endpoint,
      acceptedFormats: acceptedFormatsStr ? acceptedFormatsStr.split(",") : [],
      index: index ? parseInt(index) : null,
    });
  }, [searchParams, navigate]);

  if (
    !converterInfo.type ||
    !converterInfo.targetFormat ||
    !converterInfo.endpoint
  ) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="converterPage-section">
        <div className="converter-header">
          <h1>{converterInfo.type} Converter</h1>
          <p>
            Convert your {converterInfo.sourceFormat?.toUpperCase() || "image"}{" "}
            files to <strong>{converterInfo.targetFormat.toUpperCase()}</strong>{" "}
            format
          </p>
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Converters
          </button>
        </div>
        <FileUpload
          targetFormat={converterInfo.targetFormat}
          sourceFormat={converterInfo.sourceFormat}
          endpoint={converterInfo.endpoint}
          acceptedFormats={converterInfo.acceptedFormats}
          converterType={converterInfo.type}
          converterIndex={converterInfo.index}
        />
      </div>
    </>
  );
};

export default ConverterPage;
