# generateCombinations Function Documentation

## Overview

The `generateCombinations` function is a core utility within the **Kape Natin PH** coffee shop management system. It creates all possible product variant combinations based on variant options (such as size, temperature, etc.) for products like coffee drinks.

**Location**: `app/features/product/product-form.tsx:115`

## Function Signature

```typescript
const generateCombinations = (options: VariantOptionInputs[]) => {
  // Implementation details...
}
```

## Purpose

This function generates all possible combinations from a set of variant options to create product variants. For example, if a coffee has size options (8oz, 12oz, 16oz) and temperature options (Hot, Cold), it will generate 6 combinations: "8oz / Hot", "8oz / Cold", "12oz / Hot", "12oz / Cold", "16oz / Hot", "16oz / Cold".

## Parameters

- **`options`** (`VariantOptionInputs[]`): An array of variant option objects, where each option contains:
  - `name` (string): The option name (e.g., "Size", "Temperature")  
  - `values` (array): Array of value objects with `value` property (e.g., "8oz", "Hot")
  - `position` (number): Order position of the option

## Return Value

Returns an array of combination objects, each containing:
- **`title`** (string): Human-readable combination title (e.g., "8oz / Hot")
- **`options`** (Record<string, string>): Key-value pairs mapping option names to selected values

## Algorithm

The function uses a recursive depth-first search approach:

1. **Base Case**: If no options provided, return empty array
2. **Recursive Case**: For each option level:
   - Iterate through all values of the current option
   - Recursively generate combinations for remaining options
   - Combine current value with all downstream combinations
3. **Title Generation**: Joins all selected values with " / " separator

## Implementation Details

```typescript
const generateCombinations = (options: VariantOptionInputs[]) => {
  if (options.length === 0) return [];

  const combinations: Array<{ title: string; options: Record<string, string> }> = [];

  function generateCombos(index: number, currentCombo: Record<string, string>) {
    if (index === options.length) {
      const title = Object.values(currentCombo).join(' / ');
      combinations.push({ title, options: { ...currentCombo } });
      return;
    }

    const option = options[index];
    if (option.values) {
      for (const value of option.values) {
        generateCombos(index + 1, { ...currentCombo, [option.name]: value.value });
      }
    }
  }

  generateCombos(0, {});
  return combinations;
};
```

## Examples

### Example 1: Coffee Sizes Only

**Input:**
```typescript
const sizeOptions = [{
  name: "Size",
  values: [
    { value: "8oz", position: 0 },
    { value: "12oz", position: 1 },
    { value: "16oz", position: 2 }
  ]
}];

const combinations = generateCombinations(sizeOptions);
```

**Output:**
```typescript
[
  { title: "8oz", options: { "Size": "8oz" } },
  { title: "12oz", options: { "Size": "12oz" } },
  { title: "16oz", options: { "Size": "16oz" } }
]
```

### Example 2: Multiple Options (Size + Temperature)

**Input:**
```typescript
const multiOptions = [
  {
    name: "Size",
    values: [
      { value: "8oz", position: 0 },
      { value: "12oz", position: 1 }
    ]
  },
  {
    name: "Temperature", 
    values: [
      { value: "Hot", position: 0 },
      { value: "Cold", position: 1 }
    ]
  }
];

const combinations = generateCombinations(multiOptions);
```

**Output:**
```typescript
[
  { title: "8oz / Hot", options: { "Size": "8oz", "Temperature": "Hot" } },
  { title: "8oz / Cold", options: { "Size": "8oz", "Temperature": "Cold" } },
  { title: "12oz / Hot", options: { "Size": "12oz", "Temperature": "Hot" } },
  { title: "12oz / Cold", options: { "Size": "12oz", "Temperature": "Cold" } }
]
```

### Example 3: Triple Options (Size + Temperature + Milk)

**Input:**
```typescript
const tripleOptions = [
  {
    name: "Size",
    values: [{ value: "12oz", position: 0 }, { value: "16oz", position: 1 }]
  },
  {
    name: "Temperature",
    values: [{ value: "Hot", position: 0 }, { value: "Iced", position: 1 }]
  },
  {
    name: "Milk",
    values: [{ value: "Regular", position: 0 }, { value: "Oat", position: 1 }]
  }
];

const combinations = generateCombinations(tripleOptions);
```

**Output:**
```typescript
[
  { title: "12oz / Hot / Regular", options: { "Size": "12oz", "Temperature": "Hot", "Milk": "Regular" } },
  { title: "12oz / Hot / Oat", options: { "Size": "12oz", "Temperature": "Hot", "Milk": "Oat" } },
  { title: "12oz / Iced / Regular", options: { "Size": "12oz", "Temperature": "Iced", "Milk": "Regular" } },
  { title: "12oz / Iced / Oat", options: { "Size": "12oz", "Temperature": "Iced", "Milk": "Oat" } },
  { title: "16oz / Hot / Regular", options: { "Size": "16oz", "Temperature": "Hot", "Milk": "Regular" } },
  { title: "16oz / Hot / Oat", options: { "Size": "16oz", "Temperature": "Hot", "Milk": "Oat" } },
  { title: "16oz / Iced / Regular", options: { "Size": "16oz", "Temperature": "Iced", "Milk": "Regular" } },
  { title: "16oz / Iced / Oat", options: { "Size": "16oz", "Temperature": "Iced", "Milk": "Oat" } }
]
```

## Usage in Product Form

The function is used within a React form context to automatically generate product variants:

1. **Trigger**: Activated when variant options change via `useEffect` hook
2. **Validation**: Only processes options with valid names and values
3. **SKU Generation**: Each generated combination gets a unique SKU using `generateSku()`
4. **Default Variant**: First combination is marked as default and inherits base price
5. **Form Integration**: Results populate the variants field array for user editing

## Mathematical Complexity

- **Time Complexity**: O(V₁ × V₂ × ... × Vₙ) where Vᵢ is the number of values for option i
- **Space Complexity**: O(V₁ × V₂ × ... × Vₙ) for storing all combinations
- **Total Combinations**: Product of all option value counts

For example:
- 3 sizes × 2 temperatures = 6 combinations
- 4 sizes × 3 temperatures × 2 milk types = 24 combinations

## Error Handling

The function handles several edge cases:

- **Empty options array**: Returns empty array
- **Options without values**: Skips to next option level  
- **Invalid option structure**: Gracefully ignores malformed options

## Related Functions

- **`generateSku()`**: Creates unique SKU codes for each variant
- **Form validation**: Ensures generated variants meet schema requirements
- **`replaceVariants()`**: Updates form state with generated combinations

## Performance Considerations

- Suitable for typical coffee shop scenarios (2-4 options with 2-5 values each)
- Consider pagination or limiting for products with >100 combinations
- Combinations are generated in-memory and may impact performance with very large option sets

## Integration Points

This function is tightly integrated with:
- **React Hook Form**: Form state management
- **Zod validation**: Type safety via `VariantOptionInputs` schema
- **Product creation flow**: Automatic variant generation
- **SKU management**: Unique identifier generation for inventory tracking