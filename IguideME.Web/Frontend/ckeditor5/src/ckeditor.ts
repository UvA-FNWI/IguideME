/**
 * @license Copyright (c) 2014-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { InlineEditor } from '@ckeditor/ckeditor5-editor-inline';

import { Alignment } from '@ckeditor/ckeditor5-alignment';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic, Strikethrough, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font';
import { HorizontalLine } from '@ckeditor/ckeditor5-horizontal-line';
import { Indent, IndentBlock } from '@ckeditor/ckeditor5-indent';
import { AutoLink, Link } from '@ckeditor/ckeditor5-link';
import { List, ListProperties } from '@ckeditor/ckeditor5-list';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends InlineEditor {
	public static override builtinPlugins = [
		Alignment,
		AutoLink,
		Autoformat,
		BlockQuote,
		Bold,
		CodeBlock,
		Essentials,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		HorizontalLine,
		Indent,
		IndentBlock,
		Italic,
		Link,
		List,
		ListProperties,
		Paragraph,
		PasteFromOffice,
		Strikethrough,
		Table,
		TableToolbar,
		TextTransformation,
		Underline
	];

	public static override defaultConfig = {
		toolbar: {
			items: [
				'bold',
				'italic',
				'strikethrough',
				'underline',
				'|',
				'fontFamily',
				'fontSize',
				'fontColor',
				'fontBackgroundColor',
				'|',
				'bulletedList',
				'numberedList',
				'|',
				'alignment',
				'outdent',
				'indent',
				'|',
				'horizontalLine',
				'link',
				'codeBlock',
				'blockQuote',
				'insertTable',
				'|',
				'undo',
				'redo'
			]
		},
		language: 'en',
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		}
	};
}

export default Editor;
