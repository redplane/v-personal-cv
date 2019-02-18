export function getTotalPage(totalRecords: number, itemsPerPage: number): number {

    if (!totalRecords)
        return 1;

    if (!itemsPerPage)
        return 1;

    let iPage = totalRecords / itemsPerPage;
    if (iPage < 1)
        return 1;

    iPage = Math.floor(iPage);
    let bHasMoreRecords = (totalRecords - (itemsPerPage * iPage)) > 0;
    if (bHasMoreRecords)
        iPage++;

    return iPage;
}