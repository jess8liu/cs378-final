import { useState } from "react";

function MapButton() {
  const colors = ['transparent', '#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#FAF4D3', '#004643'];

  const [index, setIndex] = useState(0);

  const change_button_color = () => {

    if (index + 1 > 6) {
      setIndex(0);
    }
    else {
      setIndex(index + 1);
    }

  }

  const divStyle = {
    backgroundColor: colors[index]
  };


  return (
    <>
      <button className="map_cell"
        style={divStyle}
        onClick={change_button_color}
      >.</button>
    </>
  );

}

export default MapButton;