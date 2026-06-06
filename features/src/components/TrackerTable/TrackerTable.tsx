import { TrackerTableView } from '@apptly/features/components/TrackerTable/TrackerTable.view';
import { useTrackerTable } from '@apptly/features/components/TrackerTable/use-tracker-table';

export const TrackerTable = () => <TrackerTableView {...useTrackerTable()} />;
