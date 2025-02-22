import { useMemo } from "react";
// Comment out only DOTS if we need that in future
// export const DOTS: string = "...";

interface RangeProps {
  start: number;
  end: number;
}

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
  isMirrored?: boolean;
}

const range: (props: RangeProps) => number[] = ({ start, end }) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination: (
  props: PaginationProps
) => (number | string)[] | undefined = ({
  totalCount,
  pageSize,
  siblingCount = 2,
  currentPage,
  isMirrored = true,
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range({ start: 1, end: totalPageCount });
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1) as number;
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range({ start: 1, end: leftItemCount });

      //Comment out if DOTS will be required
      // return [...leftRange, DOTS, totalPageCount];

      return [...leftRange];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range({
        start: totalPageCount - rightItemCount + 1,
        end: totalPageCount,
      });

      //Comment out if DOTS will be required
      // return [firstPageIndex, DOTS, ...rightRange];

      return [...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range({
        start: leftSiblingIndex,
        end: rightSiblingIndex,
      });

      //Comment out if DOTS will be required
      // return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];

      return [...middleRange];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return isMirrored ? [...(paginationRange || [])].reverse() : paginationRange;
};
