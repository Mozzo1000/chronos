import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import Stats from './pages/Stats.jsx';
import Login from './components/Login.jsx';
import { useAuth } from './hooks/useAuth';

export function App() {
	const { isValid } = useAuth();

    if (!isValid) {
        return <Login />;
    }

	return (
		<LocationProvider>
			<div className="min-h-screen bg-[#fafafa]">
				<Header />
				<main>
					<Router>
						<Route path="/" component={Home} />
						<Route path="/stats" component={Stats} />
						<Route default component={NotFound} />
					</Router>
				</main>
			</div>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}
