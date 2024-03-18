export interface FileEntity {
	id: number;
	name: string;
	createdAt: number;
	editedAt: number;
	size: number;
	isChecked?: boolean;
}
