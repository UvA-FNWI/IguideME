import { type FC, type ReactElement } from 'react';

import AdminTitle from '@/components/atoms/admin-titles/admin-titles';
import AdminBlock from '@/components/atoms/admin-block/admin-block';
import PeerSettings from '@/components/crystals/peer-settings/peer-settings';
import ConsentSettings from '@/components/crystals/consent-settings/consent-settings';

const Settings: FC = (): ReactElement => {
	return (
		<div>
			<AdminTitle title="Settings" description="Configure the general settings for this course." />
			<AdminBlock title="Peer groups">
				<PeerSettings />
			</AdminBlock>
			<AdminBlock title="Informed Consent">
				<ConsentSettings />
			</AdminBlock>
		</div>
	);
};

export default Settings;
