import React, { useState, Fragment } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Table, TableBody, TableRow, TableCell } from "../ui/table";
import { cn } from "@/lib/utils";
import useIncomingRcDelegations from "@/api/common/useIncomingRcDelegations";
import { formatNumber } from "@/lib/utils";
type RcDelegation = {
  from: string;
  delegated_rc: number;
};

type AccountIncomingRcDelegationsCardProps = {
  delegateeAccount: string;
  limit: number;
  liveDataEnabled: boolean;
};

const buildTableBody = (delegations: RcDelegation[]) => {
  return delegations.map((delegation: RcDelegation, index: number) => {
    const isLast = index === delegations.length - 1;
    return (
      <Fragment key={index}>
        <TableRow
          className={cn(
            {
              "border-t border-gray-700": index !== 0,
              "border-b border-gray-700": !isLast,
            },
            "hover:bg-inherit"
          )}
        >
          <TableCell>{index + 1}</TableCell>
          <TableCell className="text-right">
            <Link className="text-blue-400" href={`/@${delegation.from}`}>
              {delegation.from}
            </Link>
          </TableCell>
          <TableCell className="text-right">{formatNumber(delegation.delegated_rc, false, true)}</TableCell>
        </TableRow>
      </Fragment>
    );
  });
};

const AccountIncomingRcDelegationsCard: React.FC<AccountIncomingRcDelegationsCardProps> = ({
  delegateeAccount,
  limit,
  liveDataEnabled,
}) => {
  const [isPropertiesHidden, setIsPropertiesHidden] = useState(true);
  const {
    incomingRcDelegationsData,
    isIncomingRcDelegationsLoading,
    isIncomingRcDelegationsError,
  } = useIncomingRcDelegations(delegateeAccount, limit, liveDataEnabled );

  const delegations = incomingRcDelegationsData;
  if (!delegations?.length) return <div className="text-black"></div>;

  const handlePropertiesVisibility = () => {
    setIsPropertiesHidden(!isPropertiesHidden);
  };

  return (
    <Card data-testid="incoming-rc-delegations-dropdown" className="overflow-hidden">
      <CardHeader className="p-0">
        <div
          onClick={handlePropertiesVisibility}
          className="h-full flex justify-between align-center p-2 hover:bg-slate-600 cursor-pointer px-4"
        >
          <div className="text-lg">Incoming RC Delegations</div>
          {isPropertiesHidden ? <ArrowDown /> : <ArrowUp />}
        </div>
      </CardHeader>
      <CardContent hidden={isPropertiesHidden}>
        <Table>
          <TableBody>{buildTableBody(delegations)}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AccountIncomingRcDelegationsCard;
