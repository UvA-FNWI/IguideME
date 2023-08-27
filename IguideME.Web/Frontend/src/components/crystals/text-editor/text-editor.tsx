import { FC, ReactElement } from 'react';

import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react';

type Props = {
  text?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
}

const TextEditor: FC<Props> = ({text, onChange: onChange}): ReactElement => {

  return (
    <div>
      <CKEditor
        editor={ Editor }
        data={text}
        onChange={ ( _, editor ) => {
            const data = editor.getData();
            onChange?.(data);
        } }
    />
    </div>
  )
}

export default TextEditor
