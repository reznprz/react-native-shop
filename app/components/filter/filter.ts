export interface FilterStatus {
  name: string;
  isSelected: boolean;
}

export const ALL_FILTER = 'All';

export class Filter {
  private readonly allSelectedFilter: FilterStatus = {
    name: ALL_FILTER,
    isSelected: true,
  };

  public readonly filterStatuses: FilterStatus[];

  constructor(
    // The original list of filter names (excluding "All")
    private readonly initialFilterNames: string[],
    // Optionally pass an existing array (including isSelected states).
    filterStatuses?: FilterStatus[],
  ) {
    // If we already have a FilterStatus[] from the parent, we use that.
    // Otherwise, we build a fresh array from initialFilterNames, all unselected.
    this.filterStatuses = filterStatuses ?? this.createFilterStatuses(initialFilterNames);
  }

  private createFilterStatuses(names: string[]): FilterStatus[] {
    return names.map((n) => ({ name: n, isSelected: false }));
  }

  /** Check if it's the "All" filter (case-insensitive) */
  private isAllFilter(name: string): boolean {
    return name.toLowerCase() === ALL_FILTER.toLowerCase();
  }

  /**
   * A simple toggle for one filter item (excluding "All" logic).
   */
  private toggleFilter(selected: FilterStatus): FilterStatus[] {
    return this.filterStatuses.map((f) =>
      f.name === selected.name ? { ...f, isSelected: !f.isSelected } : f,
    );
  }

  /**
   * The main toggling method that includes "All" logic.
   * Returns a *new* Filter object (immutable).
   */
  public updateFilterWithAll(selectedFilter: FilterStatus): Filter {
    const isAll = this.isAllFilter(selectedFilter.name);
    const wasSelected = selectedFilter.isSelected;

    let newStatuses: FilterStatus[];

    if (isAll) {
      // If toggling "All":
      if (!wasSelected) {
        // Toggling "All" from OFF -> ON => "All" on, everything else off
        newStatuses = this.filterStatuses.map((f) =>
          this.isAllFilter(f.name) ? { ...f, isSelected: true } : { ...f, isSelected: false },
        );
      } else {
        // Toggling "All" from ON -> OFF => just turn "All" off
        newStatuses = this.filterStatuses.map((f) =>
          this.isAllFilter(f.name) ? { ...f, isSelected: false } : f,
        );
      }
    } else {
      // If toggling a normal filter:
      if (!wasSelected) {
        // turning a filter from OFF -> ON => that filter on, "All" off
        newStatuses = this.filterStatuses.map((f) => {
          if (this.isAllFilter(f.name)) {
            return { ...f, isSelected: false };
          }
          if (f.name === selectedFilter.name) {
            return { ...f, isSelected: true };
          }
          return f;
        });
      } else {
        // turning a filter from ON -> OFF => normal toggle
        newStatuses = this.toggleFilter(selectedFilter);
      }
    }

    // Return a new Filter instance
    return new Filter(this.initialFilterNames, newStatuses);
  }

  /**
   * Returns the final filter statuses without the "All" item.
   */
  public getFinalFilterStatuses(): FilterStatus[] {
    return this.filterStatuses.filter((f) => !this.isAllFilter(f.name));
  }

  /**
   * If some (non-All) items are selected, we want [All + other items].
   * If *all* items are selected => we show "All" selected and everything else off.
   * But your condition is a bit simpler in usage:
   *   e.g. if `hasAnySelected` is true => we return "All" + statuses (with "All" off)
   *        else => we return "All" + statuses (with "All" on, everything else off)
   *
   * Implementation can vary depending on your logic. For example:
   * - If hasAnySelected is true => "All" is not selected; just ensure it's included.
   * - If hasAnySelected is false => "All" is selected, everything else off.
   *
   * But let's match your original function name. We'll keep it minimal:
   */
  public selectAllFilterIfAllSelected(anySelected: boolean): FilterStatus[] {
    // If there's at least one item selected (besides "All"),
    // we ensure "All" is present but not necessarily selected:
    if (anySelected) {
      return this.addAllFilter(false);
    } else {
      // If none are selected, let's select "All" by default.
      return this.addAllFilter(true);
    }
  }

  /**
   * Utility to ensure "All" is present in the array,
   * optionally turned on or off, while preserving other items.
   */
  private addAllFilter(shouldSelectAll: boolean): FilterStatus[] {
    const hasAll = this.filterStatuses.some((f) => this.isAllFilter(f.name));
    if (hasAll) {
      // If "All" is already in the array, we might update its isSelected
      // if `shouldSelectAll` is true, set isSelected = true, else false
      return this.filterStatuses.map((f) =>
        this.isAllFilter(f.name) ? { ...f, isSelected: shouldSelectAll } : f,
      );
    } else {
      // If no "All" item yet, we add it.
      return [{ ...this.allSelectedFilter, isSelected: shouldSelectAll }, ...this.filterStatuses];
    }
  }
}

export const removedFilter = (name: string, filters: FilterStatus[]): FilterStatus[] => {
  return filters.map((f) =>
    f.name.toLocaleLowerCase() === name.toLocaleLowerCase() ? { ...f, isSelected: false } : f,
  );
};

export const mapSelectedFilterNames = (filters: FilterStatus[], requireSelection = false) =>
  filters.filter((f) => (requireSelection ? f.isSelected : true)).map((f) => f.name.toUpperCase());
