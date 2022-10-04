import React from 'react';
import PropTypes from 'prop-types';
import { scaleTime } from 'd3-scale';
import { Slider, Tracks, Ticks } from 'react-compound-slider';
import {
  format,
  addHours,
  startOfToday,
  endOfToday,
  differenceInMilliseconds,
  isBefore,
  isAfter,
  set,
  addMinutes,
} from 'date-fns';
import Track from './components/Track';
import Tick from './components/Tick';

import './styles/index.scss';

const getTimelineConfig = (timelineStart, timelineLength) => (date) => {
  const percent = (differenceInMilliseconds(date, timelineStart) / timelineLength) * 100;
  const value = Number(format(date, 'T'));
  return { percent, value };
};

const getFormattedBlockedIntervals = (blockedDates = [], [startTime, endTime]) => {
  if (!blockedDates.length) return null;

  const timelineLength = differenceInMilliseconds(endTime, startTime);
  const getConfig = getTimelineConfig(startTime, timelineLength);

  const formattedBlockedDates = blockedDates.map((interval, index) => {
    let { start, end } = interval;

    if (isBefore(start, startTime)) start = startTime;
    if (isAfter(end, endTime)) end = endTime;

    const source = getConfig(start);
    const target = getConfig(end);

    return { id: `blocked-track-${index}`, source, target };
  });

  return formattedBlockedDates;
};

const getNowConfig = ([startTime, endTime]) => {
  const timelineLength = differenceInMilliseconds(endTime, startTime);
  const getConfig = getTimelineConfig(startTime, timelineLength);

  const source = getConfig(new Date());
  const target = getConfig(addMinutes(new Date(), 1));

  return { id: 'now-track', source, target };
};

class TimeRange extends React.Component {
  get disabledIntervals() {
    return getFormattedBlockedIntervals(this.props.disabledIntervals, this.props.timelineInterval);
  }

  get now() {
    return getNowConfig(this.props.timelineInterval);
  }

  onChange = (newTime) => {
    //  const formattedNewTime = newTime.map(t => new Date(t))
    // this.props.onChangeCallback(formattedNewTime)
  };

  checkIsSelectedIntervalNotValid = ([start, end], source, target) => {
    const { value: startInterval } = source;
    const { value: endInterval } = target;

    if ((startInterval > start && endInterval <= end) || (startInterval >= start && endInterval < end)) return true;
    if (start >= startInterval && end <= endInterval) return true;

    const isStartInBlockedInterval = start > startInterval && start < endInterval && end >= endInterval;
    const isEndInBlockedInterval = end < endInterval && end > startInterval && start <= startInterval;

    return isStartInBlockedInterval || isEndInBlockedInterval;
  };

  onUpdate = (newTime) => {
    const { onUpdateCallback } = this.props;
    const disabledIntervals = this.disabledIntervals;

    if (disabledIntervals?.length) {
      const isValuesNotValid = disabledIntervals.some(({ source, target }) =>
        this.checkIsSelectedIntervalNotValid(newTime, source, target),
      );
      const formattedNewTime = newTime.map((t) => new Date(t));
      onUpdateCallback({ error: isValuesNotValid, time: formattedNewTime });
      return;
    }

    const formattedNewTime = newTime.map((t) => new Date(t));
    onUpdateCallback({ error: false, time: formattedNewTime });
  };

  getDateTicks = () => {
    const { timelineInterval, ticksNumber } = this.props;
    return scaleTime()
      .domain(timelineInterval)
      .ticks(ticksNumber)
      .map((t) => +t);
  };

  render() {
    const {
      timelineInterval,
      selectedInterval,
      containerClassName,
      step,
      formatTick,
      bg,
      mode,
      handleClick,
      showTicks,
    } = this.props;

    const domain = timelineInterval.map((t) => Number(t));

    const disabledIntervals = this.disabledIntervals;

    return (
      <div className={containerClassName || 'react_time_range__time_range_container'} onClick={handleClick}>
        <Slider
          mode={mode}
          step={step}
          domain={domain}
          values={selectedInterval.map((t) => +t)}
          rootStyle={{ position: 'relative', width: '100%' }}
          disabled={false}
        >
          {disabledIntervals?.length && (
            <Tracks left={false} right={false}>
              {({ getTrackProps }) => (
                <>
                  {disabledIntervals.map(({ id, source, target }) => (
                    <Track key={id} source={source} target={target} getTrackProps={getTrackProps} disabled bg={bg} />
                  ))}
                </>
              )}
            </Tracks>
          )}

          <Ticks values={this.getDateTicks()}>
            {({ ticks }) => (
              <>
                {ticks.map((tick) => (
                  <Tick
                    key={tick.id}
                    tick={tick}
                    count={ticks.length}
                    format={formatTick}
                    showTicks={showTicks}
                    timelineInterval={timelineInterval}
                  />
                ))}
              </>
            )}
          </Ticks>
        </Slider>
      </div>
    );
  }
}

TimeRange.propTypes = {
  ticksNumber: PropTypes.number.isRequired,
  selectedInterval: PropTypes.arrayOf(PropTypes.object),
  timelineInterval: PropTypes.arrayOf(PropTypes.object),
  disabledIntervals: PropTypes.arrayOf(PropTypes.object),
  containerClassName: PropTypes.string,
  sliderRailClassName: PropTypes.string,
  step: PropTypes.number,
  formatTick: PropTypes.func,
};

TimeRange.defaultProps = {
  selectedInterval: [
    set(new Date(), { minutes: 0, seconds: 0, milliseconds: 0 }),
    set(addHours(new Date(), 1), { minutes: 0, seconds: 0, milliseconds: 0 }),
  ],
  timelineInterval: [startOfToday(), endOfToday()],
  formatTick: (ms) => format(new Date(ms), 'HH:mm'),
  disabledIntervals: [],
  step: 1000 * 60 * 30,
  ticksNumber: 48,
  error: false,
  mode: 3,
};

export default TimeRange;
