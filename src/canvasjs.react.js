import React from "react";
import CanvasJS from "canvasjs";

var CanvasJSChart = (props) => {
  React.useEffect(() => {
    var chart = new CanvasJS.Chart(props.containerId, props.options);
    chart.render();
    return () => chart.destroy();
  }, [props.options, props.containerId]);

  return <div id={props.containerId} style={{ width: "100%" }} />;
};

var CanvasJSReact = { CanvasJSChart: CanvasJSChart };

export default CanvasJSReact;
