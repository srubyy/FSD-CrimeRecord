import React from 'react';

export default function StatusBadge({ type = 'status', value, severity }) {
  if (type === 'tier') {
    let dotColor = 'bg-[#667085] dark:bg-[#AAB6C5]';
    let label = value;

    if (value?.toLowerCase() === 'maximum') {
      dotColor = 'bg-[#B4232C] dark:bg-[#E06A70]';
    } else if (value?.toLowerCase() === 'medium') {
      dotColor = 'bg-[#A66A00] dark:bg-[#D6A34A]';
    } else if (value?.toLowerCase() === 'isolation') {
      dotColor = 'bg-[#B4232C] dark:bg-[#E06A70]';
    } else if (value?.toLowerCase() === 'minimum') {
      dotColor = 'bg-[#167A5B] dark:bg-[#4DB58B]';
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#172033] dark:text-[#F1F4F8] font-normal">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        <span>{label}</span>
      </span>
    );
  }

  if (type === 'status') {
    const isTransferred = value?.toLowerCase() === 'transferred';
    const isReleased = value?.toLowerCase() === 'released';

    let dotColor = 'bg-[#167A5B] dark:bg-[#4DB58B]';
    let label = 'Active';

    if (isTransferred) {
      dotColor = 'bg-[#667085] dark:bg-[#AAB6C5]';
      label = 'Transferred';
    } else if (isReleased) {
      dotColor = 'bg-[#24527A] dark:bg-[#6B9BC2]';
      label = 'Released';
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#526176] dark:text-[#AAB6C5]">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        <span>{label}</span>
      </span>
    );
  }

  if (type === 'medical') {
    let dotColor = 'bg-[#167A5B] dark:bg-[#4DB58B]';

    if (severity === 'rose') {
      dotColor = 'bg-[#B4232C] dark:bg-[#E06A70]';
    } else if (severity === 'amber') {
      dotColor = 'bg-[#A66A00] dark:bg-[#D6A34A]';
    } else if (severity === 'emerald') {
      dotColor = 'bg-[#167A5B] dark:bg-[#4DB58B]';
    }

    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#526176] dark:text-[#AAB6C5]">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
        <span className="truncate max-w-[210px]">{value}</span>
      </span>
    );
  }

  return <span className="text-xs text-[#526176] dark:text-[#AAB6C5]">{value}</span>;
}
