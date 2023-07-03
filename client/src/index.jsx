import React from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css';
import './styles/index.scss';
import App from './components/App/App';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {persistor, store} from './store/index';
import {PersistGate} from 'redux-persist/es/integration/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<Provider store={store}>
			<PersistGate loading={"loading..."} persistor={persistor}>
				<App/>
			</PersistGate>
		</Provider>
	</BrowserRouter>
)
;
serviceWorkerRegistration.register();
