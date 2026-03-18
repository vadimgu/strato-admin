import Box from '@cloudscape-design/components/box';
import Icon from '@cloudscape-design/components/icon';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useFieldValue, useRecordContext, type RaRecord, type FieldProps } from '@strato-admin/admin';

export interface StarRatingFieldProps<RecordType extends RaRecord = RaRecord> extends FieldProps<RecordType> {
  /**
   * The maximum rating value.
   * @default 5
   */
  max?: number;
}

/**
 * A field component that displays a numeric rating using star icons.
 *
 * @example
 * <StarRatingField source="rating" max={5} />
 */
const StarRatingField = <RecordType extends RaRecord = RaRecord>(props: StarRatingFieldProps<RecordType>) => {
  const { source, max = 5 } = props;
  const record = useRecordContext<RecordType>();
  const value = useFieldValue<RecordType>({ source: source as any, record });

  if (value === null || value === undefined) return null;

  const rating = Number(value);
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (i <= rating) {
      stars.push(<Icon key={i} name="star-filled" variant="warning" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<Icon key={i} name="star-half" variant="warning" />);
    } else {
      stars.push(<Icon key={i} name="star" variant="subtle" />);
    }
  }

  return (
    <Box display="inline-block">
      <SpaceBetween direction="horizontal" size="xxs">
        {stars}
      </SpaceBetween>
    </Box>
  );
};

export default StarRatingField;
