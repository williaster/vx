import React from 'react';
import Dendrograms from '../components/tiles/Dendrograms';
import Show from '../components/Show';

export default () => {
  return (
    <Show
      events
      title="Dendrograms"
      component={Dendrograms}
      margin={{
        top: 80,
        left: 10,
        right: 10,
        bottom: 80,
      }}
    >
      {`import React from 'react';
import { Group } from '@vx/group';
import { Cluster, hierarchy } from '@vx/hierarchy';
import { HierarchyPointNode, HierarchyPointLink } from '@vx/hierarchy/lib/types';
import { LinkVertical } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import { ShowProvidedProps } from '../../types';

const citrus = '#ddf163';
const white = '#ffffff';
const green = '#79d259';
const aqua = '#37ac8c';
const merlinsbeard = '#f7f7f3';
const bg = '#306c90';

interface NodeShape {
  name: string;
  children?: NodeShape[];
}

const clusterData: NodeShape = {
  name: '$',
  children: [
    {
      name: 'A',
      children: [
        { name: 'A1' },
        { name: 'A2' },
        {
          name: 'C',
          children: [
            {
              name: 'C1',
            },
          ],
        },
      ],
    },
    {
      name: 'B',
      children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }],
    },
    {
      name: 'X',
      children: [
        {
          name: 'Z',
        },
      ],
    },
  ],
};

function Node({ node }: { node: HierarchyPointNode<NodeShape> }) {
  const isRoot = node.depth === 0;
  const isParent = !!node.children;

  if (isRoot) return <RootNode node={node} />;

  return (
    <Group top={node.y} left={node.x}>
      {node.depth !== 0 && (
        <circle
          r={12}
          fill={bg}
          stroke={isParent ? white : citrus}
          onClick={() => {
            alert(\`clicked: \${JSON.stringify(node.data.name)}\`);
          }}
        />
      )}
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={isParent ? white : citrus}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

function RootNode({ node }: { node: HierarchyPointNode<NodeShape> }) {
  const width = 40;
  const height = 20;
  const centerX = -width / 2;
  const centerY = -height / 2;

  return (
    <Group top={node.y} left={node.x}>
      <rect width={width} height={height} y={centerY} x={centerX} fill="url('#top')" />
      <text
        dy=".33em"
        fontSize={9}
        fontFamily="Arial"
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
        fill={bg}
      >
        {node.data.name}
      </text>
    </Group>
  );
}

export default ({
  width,
  height,
  margin = {
    top: 40,
    left: 0,
    right: 0,
    bottom: 110,
  },
}: ShowProvidedProps) => {
  if (width < 10) return null;

  const data = hierarchy<NodeShape>(clusterData);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  return (
    <svg width={width} height={height}>
      <LinearGradient id="top" from={green} to={aqua} />
      <rect width={width} height={height} rx={14} fill={bg} />
      <Cluster<NodeShape> root={data} size={[xMax, yMax]}>
        {cluster => (
          <Group top={margin.top} left={margin.left}>
            {cluster.links().map((link, i) => (
              <LinkVertical<HierarchyPointLink<NodeShape>, HierarchyPointNode<NodeShape>>
                key={\`cluster-link-\${i}\`}
                data={link}
                stroke={merlinsbeard}
                strokeWidth="1"
                strokeOpacity={0.2}
                fill="none"
              />
            ))}
            {cluster.descendants().map((node, i) => (
              <Node key={\`cluster-node-\${i}\`} node={node} />
            ))}
          </Group>
        )}
      </Cluster>
    </svg>
  );
};
`}
    </Show>
  );
};
