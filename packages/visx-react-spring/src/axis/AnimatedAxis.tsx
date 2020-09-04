import React, { useMemo } from 'react';
import Axis, { AxisProps } from '@visx/axis/lib/axis/Axis';
import { AxisScale, TicksRendererProps } from '@visx/axis/lib/types';
import AnimatedTicks from './AnimatedTicks';
import { TransitionConfig } from '../spring-configs/useLineTransitionConfig';

export default function AnimatedAxis<Scale extends AxisScale>({
  animationTrajectory,
  ...axisProps
}: Omit<AxisProps<Scale>, 'ticksComponent'> &
  Pick<TransitionConfig<Scale>, 'animationTrajectory'>) {
  // wrap the ticksComponent so we can pass animationTrajectory
  const ticksComponent = useMemo(
    () => (ticks: TicksRendererProps<Scale>) => (
      <AnimatedTicks {...ticks} animationTrajectory={animationTrajectory} />
    ),
    [animationTrajectory],
  );
  return <Axis {...axisProps} ticksComponent={ticksComponent} />;
}
