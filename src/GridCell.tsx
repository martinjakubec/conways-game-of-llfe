interface GridCellProps {
  x: number;
  y: number;
  value: boolean;
  changeValue: (x: number, y: number, value: boolean) => void;
}

export function GridCell({x, y, value, changeValue}: GridCellProps) {
  return (
    <div
      className={`w-5 h-5 ${
        value ? 'bg-gray-900' : 'bg-gray-100'
      } block m-[0.5px] box-border`}
      onClick={() => {
        console.log('gu', x, y, value);
        
        changeValue(x, y, !value);
      }}
    ></div>
  );
}
