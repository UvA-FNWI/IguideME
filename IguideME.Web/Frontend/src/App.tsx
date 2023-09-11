import { Outlet } from 'react-router-dom';
import Header from '@/components/crystals/header/header';
import { type ReactElement } from 'react';

/**
 * The main entry point to the app. Adds a header and the contents of the app
 * will be shown in Outlet, depending on the route.
 * @returns {React.ReactElement} The app.
 */
function App(): ReactElement {
	return (
		<div className="App">
			<Header />
			<Outlet />
		</div>
	);
}

export default App;
