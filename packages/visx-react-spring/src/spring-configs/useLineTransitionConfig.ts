import { useMemo } from 'react';
import { coerceNumber } from '@visx/scale';
import { AxisScale } from '@visx/axis/lib/types';
import { GridScale } from '@visx/grid/lib/types';

interface Point {
  x?: number;
  y?: number;
}

interface Line {
  from: Point;
  to: Point;
}

function animatedValue(
  animationTrajectory: 'outside' | 'center' | 'min' | 'max',
  positionOnScale: number | undefined,
  scaleMin: number | undefined,
  scaleMax: number | undefined,
  scaleHalfwayPoint: number,
): number {
  switch (animationTrajectory) {
    case 'center':
      return scaleHalfwayPoint;
    case 'min':
      return scaleMin ?? 0;
    case 'max':
      return scaleMax ?? 0;
    case 'outside':
    default:
      return ((positionOnScale ?? 0) < scaleHalfwayPoint ? scaleMin : scaleMax) ?? 0;
  }
}

function enterUpdate({ from, to }: Line) {
  return {
    fromX: from.x,
    toX: to.x,
    fromY: from.y,
    toY: to.y,
    opacity: 1,
  };
}

export type TransitionConfig<Scale extends AxisScale | GridScale> = {
  /** Scale along which animation occurs. */
  scale: Scale;
  /** Whether to animate the `x` or `y` values of a Line. */
  animateXOrY: 'x' | 'y';
  /** The scale position entering lines come from, and exiting lines leave to. */
  animationTrajectory?: 'outside' | 'center' | 'min' | 'max';
};

/**
 * A hook that returns `react-spring` transition config for animating a Line
 * horizontally, vertically, and from a specific starting point.
 */
export default function useLineTransitionConfig<Scale extends AxisScale | GridScale>({
  scale,
  animateXOrY,
  animationTrajectory: initAnimationTrajectory = 'outside',
}: TransitionConfig<Scale>) {
  const shouldAnimateX = animateXOrY === 'x';
  return useMemo(() => {
    const [a, b] = scale.range().map(coerceNumber);
    const isDescending = b != null && a != null && b < a;
    const [scaleMin, scaleMax] = isDescending ? [b, a] : [a, b];
    const scaleLength = b != null && a != null ? Math.abs(b - a) : 0;
    const scaleHalfwayPoint = scaleLength / 2;
    let animationTrajectory = initAnimationTrajectory;
    // correct direction for descending scales (like y-axis)
    if (isDescending && initAnimationTrajectory === 'min') animationTrajectory = 'max';
    if (isDescending && initAnimationTrajectory === 'max') animationTrajectory = 'min';

    const fromLeave = ({ from, to }: Line) => ({
      fromX: shouldAnimateX
        ? animatedValue(animationTrajectory, from.x, scaleMin, scaleMax, scaleHalfwayPoint)
        : from.x,
      toX: shouldAnimateX
        ? animatedValue(animationTrajectory, from.x, scaleMin, scaleMax, scaleHalfwayPoint)
        : to.x,
      fromY: shouldAnimateX
        ? from.y
        : animatedValue(animationTrajectory, from.y, scaleMin, scaleMax, scaleHalfwayPoint),
      toY: shouldAnimateX
        ? to.y
        : animatedValue(animationTrajectory, from.y, scaleMin, scaleMax, scaleHalfwayPoint),
      opacity: 0,
    });

    return { from: fromLeave, leave: fromLeave, enter: enterUpdate, update: enterUpdate };
  }, [scale, shouldAnimateX, initAnimationTrajectory]);
}
