import { type FC, type ReactElement } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getConsentSettings, postConsentSettings } from '@/api/course_settings';
import { Button, Form } from 'antd';

const ConsentSettings: FC = (): ReactElement => {
	const { data } = useQuery('consent-settings', getConsentSettings);
	if (data === undefined) {
		return <>Loading...</>;
	}

	return <ConsentSettingsForm name={data.course_name} text={data.text} />;
};

interface Props {
	name: string;
	text: string;
}

const ConsentSettingsForm: FC<Props> = ({ name, text }): ReactElement => {
	const queryClient = useQueryClient();
	const { mutate: saveConsent } = useMutation({
		mutationFn: postConsentSettings,
		onSuccess: async () => {
			await queryClient.invalidateQueries('consent-settings');
		},
	});

	return (
		<div>
			<Form
        initialValues={{ name, text }}
        name="consent_settings_form"
        onFinish={saveConsent}
      >
				<Form.Item name="text" valuePropName="text" noStyle>
					TODO
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit">Save</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default ConsentSettings;
