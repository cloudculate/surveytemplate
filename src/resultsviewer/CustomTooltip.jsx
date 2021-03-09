
  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.seriesName}</p>
          <p className="value">{"count: " + payload[0].payload.amount}</p>
        </div>
      );
    }
  
    return null;
  };


  export default CustomTooltip

