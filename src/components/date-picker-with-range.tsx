import { format, set, subYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChartInfo } from "@/contexts/chartcontext";
import { ptBR } from "date-fns/locale";

export default function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { timeContext, setTimeContext } = useChartInfo();

  const today = set(new Date(), { hours: 23, minutes: 59, seconds: 59 });
  const minDate = set(subYears(today, 3), { hours: 0, minutes: 0, seconds: 0 });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={"outline"}
            className={cn(
              "w-60 justify-start text-left font-normal",
              !timeContext && "text-muted-foreground"
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {timeContext?.from ? (
              timeContext.to ? (
                <>
                  {format(timeContext.from, "dd LLL, y", { locale: ptBR })} -{" "}
                  {format(timeContext.to, "dd LLL, y", { locale: ptBR })}
                </>
              ) : (
                format(timeContext.from, "LLL dd, y")
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={timeContext?.from}
            selected={timeContext}
            onSelect={setTimeContext}
            fromDate={minDate}
            toDate={today}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
