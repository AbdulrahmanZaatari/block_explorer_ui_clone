import { createContext, useContext } from "react";
import { IHiveChainInterface } from "@hive/wax/web";


export type HiveChainContextType = {
  hiveChain: IHiveChainInterface | undefined;
  setHiveChain: (hiveChain: IHiveChainInterface) => void;
};

export const HiveChainContext = createContext<HiveChainContextType>({
  hiveChain: undefined,
  setHiveChain: () => {}
});

export const useHiveChainContext = () => useContext(HiveChainContext);
