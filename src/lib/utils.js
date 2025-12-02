// Simple utility function for className merging
// Works without external dependencies
export function cn(...inputs) {
  const classes = [];
  
  for (const input of inputs) {
    if (!input) continue;
    
    if (typeof input === "string") {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }
  
  // Simple deduplication and merge (basic tailwind-merge replacement)
  const seen = new Set();
  const result = [];
  
  for (const cls of classes) {
    const parts = cls.split(" ");
    for (const part of parts) {
      if (part && !seen.has(part)) {
        seen.add(part);
        result.push(part);
      }
    }
  }
  
  return result.join(" ");
}

