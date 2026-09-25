// Never retain driver message/detail: PostgreSQL can include values or secrets.
export function safeStorageError(error: unknown): Record<string, string | null> {
  const e = error && typeof error === 'object' ? error as Record<string, unknown> : {};
  const code = typeof e.code === 'string' && /^[0-9A-Z]{5}$/.test(e.code) ? e.code : null;
  const messages: Record<string, string> = {
    '42P18': 'indeterminate_datatype', '42804': 'datatype_mismatch',
    '42P01': 'undefined_table', '42703': 'undefined_column', '42601': 'syntax_error',
    '23502': 'not_null_violation', '23503': 'foreign_key_violation',
    '23505': 'unique_violation', '23514': 'check_violation',
    '22P02': 'invalid_text_representation', '22007': 'invalid_datetime_format',
    '42501': 'insufficient_privilege', '40001': 'serialization_failure',
  };
  const identifier = (v: unknown) => typeof v === 'string' && /^[a-z_][a-z0-9_]{0,62}$/i.test(v) ? v : null;
  return {
    code, message: code ? messages[code] ?? 'postgres_error' : 'storage_error',
    position: typeof e.position === 'string' && /^\d{1,8}$/.test(e.position) ? e.position : null,
    routine: identifier(e.routine), table: identifier(e.table),
    column: identifier(e.column), constraint: identifier(e.constraint),
  };
}
