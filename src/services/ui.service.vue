<script>
    const injector = require('vue-inject/dist/vue-inject');
    injector
        .service('$ui', () => {
            return {
                //#region Methods

                /*
                * Calculate total page from total records & maximum number of items per page.
                * */
                loadPageCalculation(totalRecords, itemsPerPage){

                    if (!totalRecords || !itemsPerPage)
                        return 1;
                    
                    if (totalRecords < 1 || itemsPerPage < 1)
                        return 1;

                    let iPage = totalRecords / itemsPerPage;
                    if (iPage < 1)
                        return 1;

                    iPage = Math.floor(iPage);
                    let bHasMoreRecords = (totalRecords - (itemsPerPage * iPage)) > 0;
                    if (bHasMoreRecords)
                        iPage++;

                    return iPage;
                },


                /*
                * Scroll to top of window.
                * */
                scrollTop(element){
                    $(element).scrollTop(0);
                }

                //#endregion
            }
        });
</script>
