import { ValidationError } from "../../utils/errors.js";

export const SearchHelper = {
  NormalizeAndValidateSearch(search) {

    // null or undefined do not need type validation. We treat them as missing, so return as null.
    if (search == null) {
      return null;
    }

    // validate type before normalize because normalization destroys type information
    if (typeof search !== "string") {
      throw new ValidationError("Invalid search value.");
    }

    // normalize -> value at this point should be a string, not null, and not undefined.
    const normalizedSearch = search.trim();
    
    // handle missing (but valid data type)
    if (normalizedSearch === "") {
      return null;
    }

    if (normalizedSearch.length > 100) {
      throw new ValidationError("Search value must be less than 100 characters.")
    }

    return normalizedSearch;
  }
};