import DontBelong from "../assets/you-dont-belong-here-clint-collins.gif";

const Show404 = () => {
  return (
    <div>
      <div>Does not blong to this hostel</div>
      <img src={DontBelong} style={{ maxHeight: "100%", maxWidth: "100%" }} />
    </div>
  );
};

export default Show404;
