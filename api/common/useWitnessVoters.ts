import { useQuery, UseQueryResult } from "@tanstack/react-query";
import fetchingService from "@/services/FetchingService";
import Hive from "@/types/Hive";

const SORT_ASC = "asc";
const SORT_DESC = "desc";

const useWitnessVoters = (
  accountName: string,
  isModalOpen: boolean,
  isAsc: boolean,
  sortKey: string,
  refetchInterval?: number|false
) => {
  const sortDirection = isAsc ? SORT_ASC : SORT_DESC;

  const {
    data: witnessVoters,
    isLoading: isWitnessVotersLoading,
    isError: isWitnessVotersError,
  }: UseQueryResult<Hive.Voter[]> = useQuery({
    queryKey: ["witness_voters", accountName, isModalOpen, isAsc, sortKey],
    queryFn: () =>
      fetchingService.getWitnessVoters(accountName, sortKey, sortDirection),
    enabled: !!accountName && isModalOpen,
    refetchInterval,
    refetchOnWindowFocus: false,
  });

  return {
    witnessVoters,
    isWitnessVotersLoading,
    isWitnessVotersError,
  };
};

export default useWitnessVoters;
