"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
import { ReactElement } from "react";

/**
 * Renders a simple pagination component.
 *
 * @param {Object} props - The props object.
 * @param {number} props.currentPage - The current page number.
 * @param {number} props.maxPage - The maximum page number.
 * @param {() => void} props.fetchPreviousPage - The function to fetch the previous page.
 * @param {() => void} props.fetchNextPage - The function to fetch the next page.
 * @return {ReactElement} The rendered simple pagination component.
 */
const SimplePagination = ({
  currentPage,
  maxPage,
  fetchPreviousPage,
  fetchNextPage,
}: {
  currentPage: number;
  maxPage: number;
  fetchPreviousPage: () => void;
  fetchNextPage: () => void;
}): ReactElement => {
  const t = useTranslations();

  return (
    <Pagination>
      <PaginationContent>
        {currentPage > 1 && (
          <>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={fetchPreviousPage}
              >
                {t("common.pagination.previous")}
              </PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                onClick={fetchPreviousPage}
              >
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationLink isActive className="cursor-pointer">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {currentPage < maxPage && (
          <>
            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                onClick={fetchNextPage}
              >
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={fetchNextPage}
              >
                {t("common.pagination.next")}
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export { SimplePagination };
