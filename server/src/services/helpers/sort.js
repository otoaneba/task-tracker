import { ValidationError } from "../../utils/errors.js"

export const SortHelper = {
  NormalizeAndValidateSort({column, direction}) {
    // Step 0: normalize values. Set missing values (i.e., "", " ", and undefined) to null
    let sortColumn = column?.trim() || null;
    let sortDirection = direction?.trim()?.toUpperCase() || null;

    // Step 1: Validate if values are given
    let validColumns = ["title", "dueDate", "createdAt", "updatedAt"];
    let validDirections = ["ASC", "DESC"];

    if (sortColumn !== null && !validColumns.includes(sortColumn)) {
      throw new ValidationError("Invalid sort category.")
    }

    if (sortDirection !== null && !validDirections.includes(sortDirection)) {
      throw new ValidationError("Invalid order category.")
    }

    // Step 2: Run case tree
    // case 1: both are missing
    if (sortColumn === null && sortDirection === null) {
      sortColumn = this.mapSortCategory("createdAt");
      sortDirection = this.mapOrderCategory("DESC");
      return { sortColumn: sortColumn, sortDirection: sortDirection }
    }

    // case 2: column is missing but direction (order) was provided
    if (sortColumn === null && sortDirection !== null) {
      throw new ValidationError("Sort category must be provided.");
    }

    // case 3: Sort is not missing, but order is missing (valid and does not depend on content validation)
    if (sortColumn !== null && sortDirection === null) {
      sortColumn = this.mapSortCategory(sortColumn);
      sortDirection = this.mapOrderCategory("DESC");
      return { sortColumn: sortColumn, sortDirection: sortDirection }
    }

    // case 4: both provided
    if (sortColumn !== null && sortDirection !== null) {
      sortColumn = this.mapSortCategory(sortColumn);
      sortDirection = this.mapOrderCategory(sortDirection);
      return { sortColumn: sortColumn, sortDirection: sortDirection }
    }

    return { sortColumn: sortColumn, sortDirection: sortDirection }
  },

  mapSortCategory(name) {
    switch (name) {
      case "title":
        return "title";
      case "dueDate":
        return "due_date";
      case "createdAt":
        return "created_at";
      case "updatedAt":
        return "updated_at";
      default:
        throw new Error("Unexpected sortColumn");
    }
  },

  mapOrderCategory(name) {
    switch (name) {
      case "ASC":
        return name;
      case "DESC":
        return name;
      default:
        throw new Error("Unexpected sortDirection");
    }
  }
}