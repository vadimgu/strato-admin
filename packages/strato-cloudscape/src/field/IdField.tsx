import { type RaRecord, useResourceDefinition } from 'strato-core';
import TextField, { type TextFieldProps } from './TextField';

export type IdFieldProps<RecordType extends RaRecord = RaRecord> =
  TextFieldProps<RecordType>;

/**
 * A field that displays the record's ID.
 *
 * Defaults to:
 * - source="id"
 * - input={false} (hidden in forms)
 * - link="show" if the resource has a show page
 *
 * @example
 * <IdField />
 * <IdField source="identifier" />
 */
const IdField = <RecordType extends RaRecord = RaRecord>(
  props: IdFieldProps<RecordType>
) => {
  const { hasShow } = useResourceDefinition(props);
  const {
    source = 'id',
    link = hasShow ? 'show' : undefined,
    input = false,
    ...rest
  } = props;

  return (
    <TextField<RecordType>
      source={source}
      link={link}
      input={input}
      {...rest}
    />
  );
};

export default IdField;
