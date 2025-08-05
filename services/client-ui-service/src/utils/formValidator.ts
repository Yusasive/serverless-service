type ValidationRule<T> = {
    field: keyof T;
    message: string;
    validator: (value: any) => boolean;
  };
  
  export function validateForm<T>(data: T, rules: ValidationRule<T>[]): Record<string, string> {
    const errors: Record<string, string> = {};
  
    rules.forEach(({ field, validator, message }) => {
      const value = data[field];
      if (!validator(value)) {
        errors[field as string] = message;
      }
    });
  
    return errors;
  }
  