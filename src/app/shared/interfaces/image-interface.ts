/**
 * TITLE: Image Interface
 * DESCRIPTION: Image Interface to be used for img element
 * FIELD: src, alt
 * AUTHOR: Vivek Patt
 */

type src = string;
type alt = string;

export interface Image {
	src: src;
	alt?: alt;
	video?: string;
}
