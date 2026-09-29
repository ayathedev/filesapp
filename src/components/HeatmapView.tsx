import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion } from 'motion/react';
import { formatFileSize } from '@/src/lib/utils';
import { FileIcon } from './FileIcon';

interface HeatmapViewProps {
  path: string;
}

export function HeatmapView({ path }: HeatmapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/heatmap?path=${encodeURIComponent(path)}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [path]);

  useEffect(() => {
    if (!data || !containerRef.current) return;

    const container = d3.select(containerRef.current);
    container.selectAll('*').remove();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    d3.treemap()
      .size([width, height])
      .paddingOuter(4)
      .paddingInner(2)
      (root);

    const color = d3.scaleOrdinal()
      .range(['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981', '#f59e0b']);

    const leaf = container
      .selectAll('g')
      .data(root.leaves())
      .join('g')
      .attr('transform', (d: any) => `translate(${d.x0},${d.y0})`);

    leaf.append('rect')
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', d => color(d.parent?.data.name || 'root') as string)
      .attr('rx', 8)
      .style('opacity', 0.8)
      .on('mouseover', function() { d3.select(this).style('opacity', 1); })
      .on('mouseout', function() { d3.select(this).style('opacity', 0.8); });

    leaf.append('text')
      .attr('x', 5)
      .attr('y', 15)
      .text(d => d.data.name)
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('clip-path', (d, i) => `inset(0 0 0 0)`);

    leaf.append('text')
      .attr('x', 5)
      .attr('y', 30)
      .text(d => formatFileSize(d.data.value))
      .attr('font-size', '9px')
      .attr('fill', 'rgba(255,255,255,0.6)');

  }, [data]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      ref={containerRef} 
      className="flex-1 w-full h-full p-4 overflow-hidden"
    />
  );
}
