import React from 'react';
import { scaleQuantize } from '@vx/scale';
import { Mercator, Graticule } from '@vx/geo';
import * as topojson from 'topojson-client';
// @ts-ignore
import topology from '../../static/vx-geo/world-topo.json';
import { ShowProvidedProps } from '../../types';

const bg = '#f9f7e8';

// @ts-ignore
const world = topojson.feature(topology, topology.objects.units) as {
  type: 'FeatureCollection';
  features: FeatureShape[];
};

interface FeatureShape {
  type: 'Feature';
  id: string;
  geometry: { coordinates: [number, number][][]; type: 'Polygon' };
  properties: { name: string };
}

const color = scaleQuantize({
  domain: [
    Math.min(...world.features.map(f => f.geometry.coordinates.length)),
    Math.max(...world.features.map(f => f.geometry.coordinates.length)),
  ],
  range: ['#ffb01d', '#ffa020', '#ff9221', '#ff8424', '#ff7425', '#fc5e2f', '#f94b3a', '#f63a48'],
});

export default ({ width, height, events = false }: ShowProvidedProps) => {
  if (width < 10) return <div />;

  const centerX = width / 2;
  const centerY = height / 2;
  const scale = (width / 630) * 100;

  return (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={bg} rx={14} />
      <Mercator<FeatureShape>
        data={world.features}
        scale={scale}
        translate={[centerX, centerY + 50]}
      >
        {mercator => (
          <g>
            <Graticule graticule={g => mercator.path(g) || ''} stroke="rgba(33,33,33,0.05)" />
            {mercator.features.map(({ feature, path }, i) => (
              <path
                key={`map-feature-${i}`}
                d={path || ''}
                fill={color(feature.geometry.coordinates.length)}
                stroke={bg}
                strokeWidth={0.5}
                onClick={() => {
                  if (events) alert(`Clicked: ${feature.properties.name} (${feature.id})`);
                }}
              />
            ))}
          </g>
        )}
      </Mercator>
    </svg>
  );
};
