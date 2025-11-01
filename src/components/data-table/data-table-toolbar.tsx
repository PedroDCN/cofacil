interface DataTableToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function DataTableToolbar({ left, right }: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex flex-1 items-center flex-wrap gap-2">{left}</div>
      <div className="flex items-center flex-wrap gap-2">{right}</div>
    </div>
  );
}
