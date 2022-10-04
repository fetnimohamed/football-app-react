import { getHours, getMinutes } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';

const Tick = ({ tick, count, format, showTicks, timelineInterval }) => {
  const isFullHour = !getMinutes(tick.value);

  const tickLabelStyle = {
    marginLeft: `${-(100 / count) / 2}%`,
    left: `${tick.percent}%`,
  };

  const show =
    getMinutes(tick.value) === 0 ||
    getMinutes(tick.value) === 15 ||
    getMinutes(tick.value) === 30 ||
    getMinutes(tick.value) === 45 ||
    (getMinutes(tick.value) === getMinutes(timelineInterval[0]) &&
      getHours(tick.value) === getHours(timelineInterval[0]));
    // || (getMinutes(tick.value) === getMinutes(timelineInterval[1]) && getHours(tick.value) === getHours(timelineInterval[1]))

  return (
    <>
      <div
        className={`react_time_range__tick_marker${isFullHour ? '__large' : ''}`}
        style={{
          left: `${tick.percent}%`,
          height: showTicks ? '8px' : '33px',
          display: showTicks ? '' : show ? '' : 'none',
        }}
      />
      {(getMinutes(tick.value) === 0 ||
        (getMinutes(tick.value) === getMinutes(timelineInterval[0]) &&
          getHours(tick.value) === getHours(timelineInterval[0])) ||
        (getMinutes(tick.value) === getMinutes(timelineInterval[1]) &&
          getHours(tick.value) === getHours(timelineInterval[1]))) &&
        showTicks && (
          <div className="react_time_range__tick_label" style={tickLabelStyle}>
            {format(tick.value)}
          </div>
        )}
    </>
  );
};

Tick.propTypes = {
  tick: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  count: PropTypes.number.isRequired,
  format: PropTypes.func.isRequired,
};

Tick.defaultProps = { format: (d) => d };

export default Tick;
