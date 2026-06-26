import Navbar from "../components/Navbar";
import UploadDocument from "../components/UploadDocument";

function Upload() {
  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="page-title">
          Upload Notes
        </h1>

        <UploadDocument />
      </div>
    </>
  );
}
export default Upload;
