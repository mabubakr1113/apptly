import { DocumentListView } from '@apptly/features/components/DocumentList/DocumentList.view';
import { useDocumentList } from '@apptly/features/components/DocumentList/use-document-list';

export const DocumentList = () => <DocumentListView {...useDocumentList()} />;
