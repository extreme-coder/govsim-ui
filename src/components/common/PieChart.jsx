import React from 'react';
import { VictoryPie, VictoryLabel, VictoryTooltip} from 'victory';


const radian = Math.PI / 180;
const getXOffsetMultiplayerByAngle = angle =>
  Math.cos(angle - 90 * radian);
const getYOffsetMultiplayerByAngle = angle =>
  Math.sin(angle - 90 * radian);
const getXOffset = (offset, angle) =>
  offset * getXOffsetMultiplayerByAngle(angle);
const getYOffset = (offset, angle) =>
  offset * getYOffsetMultiplayerByAngle(angle);
const getAverage = array =>
  array.reduce((acc, cur) => acc + cur, 0) / array.length;

const LabelLine = (props) => {
  const { cx, cy, midAngle, middleRadius, radius } = props;
  const xStart = cx + getXOffset(middleRadius, midAngle);
  const yStart = cy + getYOffset(middleRadius, midAngle);

  const offSetMiddle = 2 * radius - middleRadius;
  const xMiddle = cx + getXOffset(offSetMiddle, midAngle);
  const yMiddle = cy + getYOffset(offSetMiddle, midAngle);

  const offSetEnd = 2.5 * radius - middleRadius;
  const xEnd = cx + getXOffset(offSetEnd, midAngle);

  return (
    <polyline
      style={{
        opacity: "0.3",
        fill: "none",
        stroke: "black",
        strokeWidth: "1px",
        strokeDasharray: "1"
      }}
      points={`${xStart},${yStart} ${xMiddle},${yMiddle} ${xEnd},${yMiddle}`}
    />
  );
};

const PieChartColors = [
  "#FFCB06",
  "#34A8DF",
  "#FF6F43",
  "#1c8c00",
  "#3d7eff",
  "#ed3942"
];

const getColors = index => PieChartColors[index % PieChartColors.length];


const Label = (props) => {
  const {
    index,
    datum,
    innerRadius,
    radius,
    slice: { startAngle, endAngle },
    nameKey,
    valueKey,
    cx,
    cy
  } = props;

  // calculation
  const middleRadius = getAverage([innerRadius, radius]);
  const midAngle = getAverage([endAngle, startAngle]);
  // const labelOffset = radius + middleRadius / 2.7;
  // const x = cx + getXOffset(labelOffset, midAngle);
  // const y = cy + getYOffset(labelOffset, midAngle);

  const name = datum[nameKey];
  const value = datum[valueKey];

  const labelOffset = 2 * radius - middleRadius;
  const tempX = cx + getXOffset(labelOffset, midAngle);
  const y = cy + getYOffset(labelOffset, midAngle) - 2;

  const textAnchor = cx < tempX ? "start" : "end";
  const x = cx < tempX ? tempX + 15 : tempX - 15;

  return (
    <g>
      <text x={x} y={y} textAnchor={textAnchor} fill={getColors(index)}>
        {`${name} : ${Math.round(value)}%`}
      </text>
      <LabelLine
        cx={cx}
        cy={cy}
        middleRadius={middleRadius}
        radius={radius}
        midAngle={midAngle}
      />
    </g>
  );
};



class CustomLabel extends React.Component {
  static defaultEvents = VictoryTooltip.defaultEvents;
	render() {
  	return (
      <g>
        <VictoryLabel {...this.props}/>
        <VictoryTooltip 
          {...this.props} 
          x={0} y={50}
          text={`# ${this.props.text}`}
          orientation="top"
          pointerLength={0}
          cornerRadius={50}
          width={100}
          height={100}
          flyoutStyle={{ fill: "white" }}
        />
      </g>
    );
  }
}


const PieChart = ({
  innerRadius,
  radius,
  height,
  width,
  data,
  nameKey,
  valueKey
}) => {
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <VictoryPie
      height={height}
      width={width}
      radius={radius}
      innerRadius={innerRadius}
      padAngle={3}
      cornerRadius={3}
      colorScale={PieChartColors}
      animate={{ duration: 300 }}
      data={data}
      x={nameKey}
      y={valueKey}
      labelComponent={
        <Label
          innerRadius={innerRadius}
          radius={radius}
          nameKey={nameKey}
          valueKey={valueKey}
          cx={centerX}
          cy={centerY}
        />
      }
    />
  );
};

PieChart.defaultProps = {
  height: 300,
  width: 400,
  innerRadius: 55,
  radius: 75,
  nameKey: "x",
  valueKey: "y"
};

export default PieChart;
