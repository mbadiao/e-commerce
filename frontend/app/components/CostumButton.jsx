"use client";
const CostumButton = ({title, containerStyle, handleClick,}) => {
  return (
    <button
      disabled={false}
      type={"button" ?? "submit"}
      className={`custom-btn ${containerStyle}`}
      onClick={handleClick}
    >
        {title}
      <span className={`flex-1`}></span>
    </button>
  );
};

export default CostumButton;
