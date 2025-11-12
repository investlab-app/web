export function parseErrorResponse(response: unknown): string | undefined {
  const res = response as Record<string, Array<string>>;
  const rawError = res.non_field_errors[0];
  if (rawError) {
    const parsedError = JSON.parse(rawError);
    if (parsedError) {
      return parsedError.msg;
    }
  }
}
