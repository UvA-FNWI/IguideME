import { FC, ReactElement} from 'react';
import TextEditor from '@/components/atoms/text-editor/text-editor';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getConsentSettings, postConsentSettings } from '@/api/course_settings';
import { Button, Form } from 'antd';

const ConsentSettings: FC = (): ReactElement => {
    const { data } = useQuery("consent-settings", getConsentSettings);
    if (data) {
        return (<ConsentSettingsForm name={data.course_name} text={data.text}/>)
    }

    return (<>Loading...</>);
}

type Props = {
  name: string;
  text: string;
}

const ConsentSettingsForm: FC<Props> = ({name, text}): ReactElement => {
  const queryClient = useQueryClient();
  const {mutate: saveConsent} = useMutation({mutationFn: postConsentSettings, onSuccess: () => queryClient.invalidateQueries('consent-settings')})

  return (
    <div>
      <Form name='consent_settings_form'
        initialValues={{name, text}}
        onFinish={saveConsent}
        >
        <Form.Item name='text' valuePropName='text' noStyle>
          <TextEditor />
        </Form.Item>
        <Form.Item >
            <Button htmlType='submit'>
              Save
            </Button>
        </Form.Item>
      </Form>
    </div>

  )
}

export default ConsentSettings
