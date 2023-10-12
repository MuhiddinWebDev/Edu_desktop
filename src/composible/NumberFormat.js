export function useParsenumber (input) {
    const nums = input.replace(/(,|\$|\s)/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums)) {
      return Number(nums)
    };
    return nums === "" ? null : Number.NaN;
}

export function useFormatnumber (value) {
    if (value === null) return "";
    return `${value.toLocaleString("us-US").replaceAll(',', ' ')}`;
}