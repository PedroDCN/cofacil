import { set, subMonths } from "date-fns";
import React, { createContext, useContext, useEffect, useState } from "react";

interface Context {
  timeContext: any;
  setTimeContext: any;
  dispatch: any;
  filter: any;
  modifyFilter: any;
}

const chartContext = createContext<Context>({} as Context);

export function ChartContextProvider(props: any) {
  const [timeContext, setTimeContext] = useState({});
  const [filter, setFilter] = useState({
    filter: {},
  });

  function dispatch(newTime: any) {
    setTimeContext((currTimeContext: any) => ({
      ...currTimeContext,
      ...newTime,
    }));
  }

  function modifyFilter(newFilter: any) {
    setFilter((currFilter: any) => ({
      ...currFilter,
      ...newFilter,
    }));
  }

  useEffect(() => {
    let to = set(new Date(), { hours: 0, minutes: 0, seconds: 0 });
    const from = subMonths(to, 5);
    to = set(to, { hours: 23, minutes: 59, seconds: 59 });
    setTimeContext({ from, to });
  }, []);

  return (
    <chartContext.Provider
      value={{ timeContext, setTimeContext, dispatch, filter, modifyFilter }}
    >
      {props.children}
    </chartContext.Provider>
  );
}

export function useChartInfo(): Context {
  return useContext(chartContext);
}
