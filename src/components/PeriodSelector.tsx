import { useChartInfo } from "@/contexts/chartcontext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function PeriodSelector() {
  const { timeContext, dispatch: dispatchTime } = useChartInfo();

  const today = new Date();
  const minDate = new Date(today.getTime());
  minDate.setFullYear(minDate.getFullYear() - 3);

  return (
    <div className='flex gap-3'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={"w-[245px] pl-3 text-left font-normal"}
          >
            {format(timeContext.from, "dd/MM/yyyy")} &mdash;{" "}
            {format(timeContext.to, "dd/MM/yyyy")}
            {/* <i className='pi pi-calendar ml-2 opacity-50'></i> */}
            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0 flex max-sm:flex-col gap-3 mx-2'
          align='center'
        >
          <Calendar
            mode='single'
            fromDate={minDate}
            toDate={today}
            selected={timeContext.from}
            onSelect={(day: any) => {
              if (day) {
                dispatchTime({ from: day });
              }
            }}
            disabled={(date) =>
              date > new Date() || date < new Date("2000-01-01")
            }
            defaultMonth={
              new Date(
                new Date(today.getTime()).setMonth(timeContext.from.getMonth())
              )
            }
            initialFocus
          />
          <Calendar
            mode='single'
            selected={timeContext.to}
            fromDate={minDate}
            toDate={today}
            onSelect={(day: any) => {
              if (day) {
                day = set(day, { hours: 23, minutes: 59, seconds: 59 });
                dispatchTime({ to: day });
              }
            }}
            disabled={(date) =>
              date > set(new Date(), { hours: 23, minutes: 59, seconds: 59 }) ||
              date < new Date("2000-01-01")
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
