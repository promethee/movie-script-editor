import type { ScriptStats } from '../fountain/stats';

interface StatsBarProps {
  stats: ScriptStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const formatNumber = (n: number) => new Intl.NumberFormat().format(n);
  return (
    <div className="flex items-center gap-3 text-[11px] text-neutral-500">
      <span>
        {formatNumber(stats.wordCount)} word{stats.wordCount === 1 ? '' : 's'}
      </span>
      <span>
        {stats.sceneCount} scene{stats.sceneCount === 1 ? '' : 's'}
      </span>
      <span>
        ~{stats.estimatedPages} page{stats.estimatedPages === 1 ? '' : 's'}
      </span>
      <span>
        ~{stats.estimatedMinutes} minute
        {stats.estimatedMinutes === 1 ? '' : 's'}
      </span>
    </div>
  );
}
