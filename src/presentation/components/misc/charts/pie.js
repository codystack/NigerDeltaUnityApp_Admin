import React from "react";
// import "@rsuite/dist/styles/rsuite-default.css";
import { PieChart } from "@rsuite/charts";

export default function OSPie(props) {
  let { sampleData } = props;
  // Sample data
  //   const sampleData = [
  //     ["Android", 30],
  //     ["iOS", 40],
  //     ["Others", 30],
  //   ];

  return (
    <div
      style={{
        display: "block",
        paddingLeft: 5,
      }}
    >
      <h4>Operating System Users</h4>
      <PieChart name="PieChart" data={sampleData} />
    </div>
  );
}
