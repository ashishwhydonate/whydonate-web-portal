import { Image } from './image-interface';
/**
 * TITLE: Category Interface
 * DESCRIPTION: Category Interface used in search component
 * FIELD: id, name, image
 * AUTHOR: Vivek Patt
 */
export interface Category {
	id: number;
	name: string;
	image: Image;
}
