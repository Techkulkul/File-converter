import "../css/Body.css";
import ConverterContainer from "./ConverterContainer";
import DragFile from "./DragFile";
import cartoon from "/Researching-amico.svg";

const Body = () => {
  return (
    <>
      <section className="main-content">
        <div className="drop-section">
          <div className="info-section">
            <div className="tite-section">
              <h2>Convert Free</h2>
              <h2>Online Converter Files</h2>
              <p>
                Easily convert videos, documents, eBooks, images, audio, PDFs,
                and software. <br />
                All-in-one platform for all your file conversion needs.
              </p>
            </div>
            <div className="drop-box">{/* <DragFile /> */}</div>
          </div>
          <div className="cartoon">
            <img
              src={cartoon}
              className="cartoon-img"
              alt="cartoon-image"
            ></img>
          </div>
        </div>
        <div className="recommend-section">
          <div className="recommend-cnt">
            <ConverterContainer />
          </div>
        </div>
      </section>
    </>
  );
};

export default Body;
