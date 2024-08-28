import { useQuery, UseQueryResult } from "@tanstack/react-query";
import fetchingService from "@/services/FetchingService";
import Hive from "@/types/Hive";
import { config } from "@/Config";

const useIncomingRcDelegations = (
  delegateeAccount: string, 
  limit: number, 
  liveDataEnabled: boolean
) => {
  const {
    data: incomingRcDelegationsData,
    isLoading: isIncomingRcDelegationsLoading,
    isError: isIncomingRcDelegationsError,
  }: UseQueryResult<Hive.RCDelegations[]> = useQuery({
    queryKey: ["IncomingRcDelegations", delegateeAccount, limit],
    queryFn: () => fetchingService.getIncomingRcDelegations(delegateeAccount, limit),
    refetchInterval: liveDataEnabled ? config.accountRefreshInterval : false,
    select: (data) => {
      if (Array.isArray(data)) {
        return data.sort((a: Hive.RCDelegations, b: Hive.RCDelegations) =>
          a.from.toLowerCase().localeCompare(b.from.toLowerCase())
        );
      }
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return {
    incomingRcDelegationsData,
    isIncomingRcDelegationsLoading,
    isIncomingRcDelegationsError,
  };
};

export default useIncomingRcDelegations;
