import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

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
}) => {
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
                                Previous
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
                                Next
                            </PaginationNext>
                        </PaginationItem>
                    </>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default SimplePagination;
