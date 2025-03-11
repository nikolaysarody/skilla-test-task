import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';
import App from '~/App.tsx';
import 'dayjs/locale/ru';
import dayjs from '~/shared/config/dayjsConfig.ts';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from '~/redux/store.ts';

dayjs.locale('ru');

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <App/>
            <ToastContainer/>
        </Provider>
    </StrictMode>,
);
