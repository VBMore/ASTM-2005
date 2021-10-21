export default function ChecklistsListViewQueryOptions(context) {
    let searchString = context.searchString;
    let queryBuilder = context.dataQueryBuilder();

    queryBuilder.orderBy('UpdatedOn desc','ShortDescription asc').expand('ChecklistBusObjects_Nav').filter(`ChecklistBusObjects_Nav/any(cbo : cbo/Equipment_Nav/EquipId eq '${context.binding.EquipId}')`);
    queryBuilder.filter().and(queryBuilder.filterTerm(`substringof('${searchString.toLowerCase()}', tolower(ShortDescription))`));

    return queryBuilder;
}
