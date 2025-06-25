// import logo from "/png.png";
import "../css/ConverterBox.css";

const ConverterBox = ({ logo, title, info }) => {
  return (
    <>
      <div className="converter-box">
        <img src={logo} className="converter-logo"></img>
        <br />
        <h3>{title}</h3>
        <br />
        <p>{info}</p>
      </div>
    </>
  );
};

export default ConverterBox;
